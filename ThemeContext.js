import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light } from './theme';

// Values stored in AsyncStorage: 'Dark' | 'Light' | 'System'
const STORAGE_KEY = '@nevertowed_theme_pref';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null — live, updates if system changes

  // Start with 'System' so the app renders immediately using device preference.
  // AsyncStorage load will update this if the user has saved a manual choice.
  const [preference, setPreferenceLocal] = useState('System');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'Dark' || saved === 'Light' || saved === 'System') {
        setPreferenceLocal(saved);
      }
      // If nothing is saved yet, 'System' stays — correct default behaviour.
    }).catch(() => {
      // AsyncStorage unavailable — silently keep System default.
    });
  }, []);

  const setPreference = async (pref) => {
    setPreferenceLocal(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch (e) {
      console.warn('ThemeContext: could not persist preference', e);
    }
  };

  // Resolve which colour set is actually active
  const resolved =
    preference === 'Light' ? 'light'
    : preference === 'Dark' ? 'dark'
    : (systemScheme ?? 'dark'); // 'System' — follow device; fall back to dark if API unavailable

  const colors = resolved === 'light' ? light : dark;
  const isDark = resolved === 'dark';

  // No blocking null — render immediately so NavigationContainer initialises on time.
  return (
    <ThemeContext.Provider value={{ colors, preference, setPreference, isDark, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be called inside ThemeProvider');
  return ctx;
}
