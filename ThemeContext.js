import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light } from './theme';

// ─────────────────────────────────────────────────────────────
// ThemeContext
//   • themePref  — user's saved choice: 'dark' | 'light' | 'system'
//   • setThemePref — persists choice to AsyncStorage
//   • colors — the resolved token set for the current pref + device scheme
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = '@nevertowed_theme';

export const ThemeContext = createContext({
  themePref: 'dark',
  setThemePref: () => {},
  colors: dark,
});

export function ThemeProvider({ children, initialPref = 'dark' }) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [themePref, setThemePrefState] = useState(initialPref);

  // Resolved colors: system falls back to device scheme, default dark
  const resolvedScheme =
    themePref === 'system'
      ? (systemScheme ?? 'dark')
      : themePref;
  const colors = resolvedScheme === 'light' ? light : dark;

  const setThemePref = useCallback(async (pref) => {
    setThemePrefState(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch (_) {
      // Non-fatal — preference just won't persist
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themePref, setThemePref, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook */
export function useTheme() {
  return useContext(ThemeContext);
}

/** Load saved preference from AsyncStorage. Returns 'dark' | 'light' | 'system'. */
export async function loadSavedTheme() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
  } catch (_) {}
  return 'dark';
}
