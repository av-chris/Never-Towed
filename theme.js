// ─────────────────────────────────────────────────────────────
// Never Towed — design tokens
// Keep dark values exactly as the existing screens use them.
// Light values are a companion palette, not an inversion.
// ─────────────────────────────────────────────────────────────

export const dark = {
  // Background gradient
  gradientBg: ['#1a1a2e', '#0d0d0d'],

  // Surfaces
  surface: 'rgba(255,255,255,0.05)',
  surfaceSecondary: 'rgba(255,255,255,0.03)',

  // Text
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.5)',
  textTertiary: 'rgba(255,255,255,0.4)',
  textMuted: 'rgba(255,255,255,0.35)',

  // Borders / dividers
  border: 'rgba(99,102,241,0.18)',
  borderAccent: 'rgba(99,102,241,0.25)',
  divider: 'rgba(255,255,255,0.08)',

  // Brand accent (indigo)
  accent: '#a5b4fc',
  accentBg: 'rgba(99,102,241,0.2)',
  accentBgSoft: 'rgba(99,102,241,0.18)',
  accentBorder: 'rgba(99,102,241,0.35)',

  // Status — green
  green: '#4cd964',
  greenBg: 'rgba(76,217,100,0.15)',
  greenBorder: 'rgba(76,217,100,0.25)',

  // Status — red
  red: '#f87171',
  redBg: 'rgba(255,107,107,0.15)',
  redBorder: 'rgba(248,113,113,0.3)',

  // Status — amber
  amber: '#fbbf24',
  amberBg: 'rgba(251,191,36,0.12)',

  // Timer ring
  timerProtected: '#4cd964',
  timerExpired: '#ff6b6b',
  timerDefault: '#6366f1',
  timerRingBg: 'rgba(0,0,0,0.2)',

  // Plate / muted icon colour
  iconMuted: '#8e8e93',

  // Card shadows (none — dark mode relies on surface contrast)
  cardShadow: {},

  // Status bar
  statusBar: 'light',

  // Tab bar
  blurTint: 'dark',
  tabBarBorder: 'rgba(255,255,255,0.1)',
  tabActiveIcon: '#a5b4fc',
  tabInactiveIcon: 'rgba(255,255,255,0.45)',
  tabActiveBg: 'rgba(99,102,241,0.18)',
  tabActiveBorder: 'rgba(99,102,241,0.35)',

  // Header chrome
  backButtonBg: 'rgba(255,255,255,0.07)',
  backButtonBorder: 'rgba(255,255,255,0.12)',
  headerBadgeBg: 'rgba(99,102,241,0.18)',
  headerBadgeBorder: 'rgba(99,102,241,0.35)',
};

export const light = {
  // Background — very slightly indigo-tinted light gray (not pure white)
  gradientBg: ['#f2f2f7', '#e9e9f0'],

  // Surfaces — white cards lifted by shadow, not border contrast
  surface: '#ffffff',
  surfaceSecondary: '#f5f5fa',

  // Text
  text: '#1c1c1e',
  textSecondary: '#6c6c70',
  textTertiary: '#8e8e93',
  textMuted: '#aeaeb2',

  // Borders / dividers — subtle, for definition not contrast
  border: 'rgba(60,60,67,0.1)',
  borderAccent: 'rgba(99,102,241,0.2)',
  divider: 'rgba(60,60,67,0.08)',

  // Brand accent — slightly deeper indigo than dark so it pops on white
  accent: '#6366f1',
  accentBg: 'rgba(99,102,241,0.09)',
  accentBgSoft: 'rgba(99,102,241,0.07)',
  accentBorder: 'rgba(99,102,241,0.22)',

  // Status — green
  green: '#34c759',
  greenBg: 'rgba(52,199,89,0.12)',
  greenBorder: 'rgba(52,199,89,0.25)',

  // Status — red
  red: '#ff3b30',
  redBg: 'rgba(255,59,48,0.08)',
  redBorder: 'rgba(255,59,48,0.2)',

  // Status — amber
  amber: '#f59e0b',
  amberBg: 'rgba(245,158,11,0.1)',

  // Timer ring
  timerProtected: '#34c759',
  timerExpired: '#ff3b30',
  timerDefault: '#6366f1',
  timerRingBg: 'rgba(99,102,241,0.04)',

  // Plate / muted icon colour
  iconMuted: '#8e8e93',

  // Card shadows — elevation instead of surface contrast
  cardShadow: {
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  // Status bar
  statusBar: 'dark',

  // Tab bar
  blurTint: 'light',
  tabBarBorder: 'rgba(0,0,0,0.08)',
  tabActiveIcon: '#6366f1',
  tabInactiveIcon: 'rgba(0,0,0,0.35)',
  tabActiveBg: 'rgba(99,102,241,0.09)',
  tabActiveBorder: 'rgba(99,102,241,0.2)',

  // Header chrome
  backButtonBg: 'rgba(0,0,0,0.05)',
  backButtonBorder: 'rgba(0,0,0,0.08)',
  headerBadgeBg: 'rgba(99,102,241,0.09)',
  headerBadgeBorder: 'rgba(99,102,241,0.2)',
};
