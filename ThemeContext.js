import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light } from './theme';

// Stored values: 'Dark' | 'Light' | 'System'
const STORAGE_KEY = '@nevertowed_theme_pref';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  // preference mirrors the Settings UI labels so no mapping layer is needed
  const [preference, setPreferenceState] = useState('System');
  const [loaded, setLoaded] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'Dark' || saved === 'Light' || saved === 'System') {
          setPreferenceState(saved);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const setPreference = async (pref) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch (e) {
      console.warn('ThemeContext: could not persist preference', e);
    }
  };

  // Resolve which scheme is actually active
  const resolved =
    preference === 'Light' ? 'light'
    : preference === 'Dark' ? 'dark'
    : (systemScheme ?? 'dark'); // default to dark when system is null (no preference)

  const colors = resolved === 'light' ? light : dark;
  const isDark = resolved === 'dark';

  // Don't render until we know the saved preference (avoids a flash)
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colors, preference, setPreference, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
