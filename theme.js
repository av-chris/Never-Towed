// ─────────────────────────────────────────────────────────────
// Color tokens for dark and light themes.
// All screens import { dark, light } from './theme'.
// ─────────────────────────────────────────────────────────────

export const dark = {
  // Gradient
  gradientStart:       '#1a1a2e',
  gradientEnd:         '#0d0d0d',
  // Status bar
  statusBar:           'light',
  // Text
  text:                '#ffffff',
  textSecondary:       'rgba(255,255,255,0.5)',
  textMuted:           'rgba(255,255,255,0.35)',
  textPlaceholder:     'rgba(255,255,255,0.3)',
  // Surfaces
  surface:             'rgba(255,255,255,0.05)',
  surfaceSub:          'rgba(255,255,255,0.03)',
  surfaceInput:        'rgba(255,255,255,0.05)',
  // Borders
  border:              'rgba(99,102,241,0.25)',
  borderSubtle:        'rgba(255,255,255,0.06)',
  borderInput:         'rgba(99,102,241,0.15)',
  borderWeak:          'rgba(255,255,255,0.1)',
  // Back / action buttons
  backBtnBg:           'rgba(255,255,255,0.07)',
  backBtnBorder:       'rgba(255,255,255,0.12)',
  // Header icon badge
  headerBadgeBg:       'rgba(99,102,241,0.18)',
  headerBadgeBorder:   'rgba(99,102,241,0.35)',
  // Card icon badges
  cardBadgePrimary:    'rgba(99,102,241,0.2)',
  cardBadgePurple:     'rgba(196,181,253,0.15)',
  cardBadgeAmber:      'rgba(251,191,36,0.12)',
  cardBadgeGreen:      'rgba(76,217,100,0.12)',
  cardBadgeRed:        'rgba(252,165,165,0.12)',
  cardBadgeTeal:       'rgba(167,243,208,0.12)',
  // Misc
  chevron:             'rgba(255,255,255,0.4)',
  divider:             'rgba(255,255,255,0.08)',
  dividerSubtle:       'rgba(255,255,255,0.06)',
  emptyIcon:           'rgba(255,255,255,0.2)',
  timerRingBg:         'rgba(0,0,0,0.2)',
  // Modal / picker
  modalBg:             '#16162a',
  modalBorder:         'rgba(99,102,241,0.25)',
  modalHandle:         'rgba(255,255,255,0.2)',
  modalSearchBg:       'rgba(255,255,255,0.07)',
  modalSearchBorder:   'rgba(99,102,241,0.15)',
  stateOptionBorder:   'rgba(255,255,255,0.07)',
  // Bottom tab bar
  tabBarTint:          'dark',
  tabBarIconActive:    '#a5b4fc',
  tabBarIconInactive:  'rgba(255,255,255,0.45)',
  tabBarActiveBg:      'rgba(99,102,241,0.18)',
  tabBarActiveBorder:  'rgba(99,102,241,0.35)',
  tabBarTopBorder:     'rgba(255,255,255,0.1)',
};

export const light = {
  // Gradient
  gradientStart:       '#eef2ff',
  gradientEnd:         '#f8faff',
  // Status bar
  statusBar:           'dark',
  // Text
  text:                '#1a1a2e',
  textSecondary:       'rgba(26,26,46,0.55)',
  textMuted:           'rgba(26,26,46,0.4)',
  textPlaceholder:     'rgba(26,26,46,0.35)',
  // Surfaces
  surface:             'rgba(99,102,241,0.07)',
  surfaceSub:          'rgba(99,102,241,0.04)',
  surfaceInput:        'rgba(99,102,241,0.07)',
  // Borders
  border:              'rgba(99,102,241,0.28)',
  borderSubtle:        'rgba(99,102,241,0.1)',
  borderInput:         'rgba(99,102,241,0.22)',
  borderWeak:          'rgba(99,102,241,0.15)',
  // Back / action buttons
  backBtnBg:           'rgba(99,102,241,0.09)',
  backBtnBorder:       'rgba(99,102,241,0.2)',
  // Header icon badge
  headerBadgeBg:       'rgba(99,102,241,0.14)',
  headerBadgeBorder:   'rgba(99,102,241,0.28)',
  // Card icon badges (same hue family, lighter bg in light mode)
  cardBadgePrimary:    'rgba(99,102,241,0.14)',
  cardBadgePurple:     'rgba(196,181,253,0.22)',
  cardBadgeAmber:      'rgba(217,119,6,0.12)',
  cardBadgeGreen:      'rgba(22,163,74,0.12)',
  cardBadgeRed:        'rgba(220,38,38,0.1)',
  cardBadgeTeal:       'rgba(13,148,136,0.12)',
  // Misc
  chevron:             'rgba(26,26,46,0.35)',
  divider:             'rgba(26,26,46,0.09)',
  dividerSubtle:       'rgba(26,26,46,0.07)',
  emptyIcon:           'rgba(26,26,46,0.25)',
  timerRingBg:         'rgba(255,255,255,0.6)',
  // Modal / picker
  modalBg:             '#f4f6ff',
  modalBorder:         'rgba(99,102,241,0.28)',
  modalHandle:         'rgba(99,102,241,0.25)',
  modalSearchBg:       'rgba(99,102,241,0.07)',
  modalSearchBorder:   'rgba(99,102,241,0.2)',
  stateOptionBorder:   'rgba(99,102,241,0.1)',
  // Bottom tab bar
  tabBarTint:          'light',
  tabBarIconActive:    '#4f46e5',
  tabBarIconInactive:  'rgba(26,26,46,0.4)',
  tabBarActiveBg:      'rgba(99,102,241,0.12)',
  tabBarActiveBorder:  'rgba(99,102,241,0.28)',
  tabBarTopBorder:     'rgba(99,102,241,0.15)',
};
