import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from './ThemeContext';

function getTimeRemaining(expirationDate) {
  if (!expirationDate) return { label: '24:00', expired: false, hasPermit: false };

  const end = new Date(expirationDate);
  const now = new Date();
  const diffMs = end - now;

  if (Number.isNaN(end.getTime())) return { label: '24:00', expired: false, hasPermit: false };

  if (diffMs <= 0) return { label: 'Expired', expired: true, hasPermit: true };

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return {
    label: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    expired: false,
    hasPermit: true,
  };
}

function formatHistoryDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function findVehicleForPermit(vehicles, permit) {
  if (!permit) return null;
  return (
    vehicles.find(
      (v) =>
        v.licence_plate === permit.licence_plate &&
        v.licence_state === permit.licence_state
    ) ?? null
  );
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const db = useSQLiteContext();
  const [vehicles, setVehicles] = useState([]);
  const [permits, setPermits] = useState([]);
  // All active permits; single = static card, multiple = horizontal paged scroll
  const [activePermits, setActivePermits] = useState([]);
  // Tick forces a re-render every 60 s so the timer stays live without leaving the screen
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const vehicleResult = await db.getAllAsync('SELECT * FROM vehicles');
        const permitResult = await db.getAllAsync(
          'SELECT * FROM permits ORDER BY issue_date DESC'
        );
        const activeResult = await db.getAllAsync(
          'SELECT * FROM permits WHERE is_active = 1 ORDER BY expiration_date DESC'
        );

        setVehicles(vehicleResult);
        setPermits(permitResult);
        setActivePermits(activeResult);
      };
      loadData();
    }, [db])
  );

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  if (!fontsLoaded) return null;

  // First active permit used for single-card / fallback display
  const activePermit = activePermits[0] ?? null;

  // Width for each paged card inside the padded dashboard (paddingHorizontal: 16 on each side)
  const cardWidth = width - 32;

  // Clears the given permit's active flag in SQLite and refreshes the active list (DEV only)
  const handleDebugClear = async (permit) => {
    if (!permit?.id) return;
    await db.runAsync('UPDATE permits SET is_active = 0 WHERE id = ?', [permit.id]);
    const activeResult = await db.getAllAsync(
      'SELECT * FROM permits WHERE is_active = 1 ORDER BY expiration_date DESC'
    );
    setActivePermits(activeResult);
  };

  // Renders one hero card for a given permit (permit may be null = no active permit)
  const renderHeroCard = (permit, extraStyle) => {
    const vehicle = findVehicleForPermit(vehicles, permit);
    // Access tick so every 60-second tick triggers a fresh time calculation
    void tick;
    const timer = getTimeRemaining(permit?.expiration_date);
    const timerColor = timer.expired
      ? colors.timerExpired
      : timer.hasPermit
        ? colors.timerProtected
        : colors.timerDefault;

    const displayName =
      vehicle?.nickname ||
      permit?.licence_plate ||
      vehicles[0]?.nickname ||
      vehicles[0]?.licence_plate ||
      'No vehicle selected';

    const displayMakeModel = permit
      ? `${permit.make} · ${permit.model}`
      : vehicles[0]
        ? `${vehicles[0].make} · ${vehicles[0].model}`
        : 'Add a vehicle to get started';

    const displayPlate = permit
      ? `${permit.licence_plate} · ${permit.licence_state}`
      : vehicles[0]
        ? `${vehicles[0].licence_plate} · ${vehicles[0].licence_state}`
        : null;

    const statusLabel = timer.expired
      ? 'Permit expired'
      : permit
        ? 'Protected'
        : 'Not registered';

    const statusBg = timer.expired
      ? colors.redBg
      : permit
        ? colors.greenBg
        : colors.accentBgSoft;

    const statusTextColor = timer.expired
      ? colors.timerExpired
      : permit
        ? colors.timerProtected
        : colors.textTertiary;

    return (
      <TouchableOpacity
        key={permit?.id ?? 'empty'}
        style={[
          styles.currentCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderAccent,
            ...colors.cardShadow,
          },
          extraStyle,
        ]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('VehicleDetail', { permit, vehicle })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.cardIconBadge, { backgroundColor: colors.accentBg }]}>
              <Ionicons name="car-sport" size={16} color={colors.accent} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Current Vehicle</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusTextColor }]} />
            <Text style={[styles.statusText, { color: statusTextColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.currentBody}>
          <View style={styles.currentInfo}>
            <Text style={[styles.vehicleName, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.vehicleDetail, { color: colors.textSecondary }]}>{displayMakeModel}</Text>
            {displayPlate ? (
              <View style={styles.plateRow}>
                <Ionicons name="card-outline" size={14} color={colors.iconMuted} />
                <Text style={[styles.plateText, { color: colors.iconMuted }]}>{displayPlate}</Text>
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.timerRing,
              {
                borderColor: timerColor,
                backgroundColor: colors.timerRingBg,
                width: width * 0.26,
                height: width * 0.26,
                borderRadius: (width * 0.26) / 2,
              },
            ]}
          >
            <Text style={[styles.timerText, { color: colors.text }]}>{timer.label}</Text>
            <Text style={[styles.timerLabel, { color: colors.iconMuted }]}>
              {permit ? 'Time left' : 'Default'}
            </Text>
          </View>
        </View>

        {/* Debug-only button to clear active status — never shown in production */}
        {__DEV__ && permit && (
          <TouchableOpacity
            style={[
              styles.debugButton,
              { backgroundColor: colors.accentBgSoft, borderColor: colors.border },
            ]}
            onPress={() => handleDebugClear(permit)}
            activeOpacity={0.7}
          >
            <Text style={[styles.debugText, { color: colors.textMuted }]}>Debug: Clear</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={colors.gradientBg} style={styles.container}>
      <StatusBar style={colors.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.dashboard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Never Towed</Text>
              <Text style={[styles.subGreeting, { maxWidth: width * 0.72, color: colors.textSecondary }]}>
                Keep your car protected from surprise tows
              </Text>
            </View>
            <View style={[
              styles.headerIcon,
              { backgroundColor: colors.headerBadgeBg, borderColor: colors.headerBadgeBorder },
            ]}>
              <Ionicons name="shield-checkmark" size={22} color={colors.accent} />
            </View>
          </View>

          {/* Current Vehicle — single static card or horizontal paged scroll */}
          {activePermits.length > 1 ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.heroScroll}
            >
              {activePermits.map((p) => renderHeroCard(p, { width: cardWidth }))}
            </ScrollView>
          ) : (
            renderHeroCard(activePermit, null)
          )}

          {/* Saved Vehicles + History */}
          <View style={styles.bottomRow}>
            {/* Saved Vehicles */}
            <View style={[
              styles.sideCard,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.borderAccent,
                ...colors.cardShadow,
              },
            ]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(196,181,253,0.15)' }]}>
                    <Ionicons name="bookmark" size={14} color="#c4b5fd" />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Saved Vehicles</Text>
                </View>
                <Text style={[styles.cardCount, { color: colors.textMuted }]}>{vehicles.length}</Text>
              </View>

              <ScrollView
                style={styles.cardScroll}
                contentContainerStyle={styles.cardScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {vehicles.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="car-outline" size={28} color={colors.textMuted} />
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                      Save your car to register in one tap
                    </Text>
                  </View>
                ) : (
                  vehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          ...colors.cardShadow,
                        },
                      ]}
                      onPress={() => navigation.navigate('QuickRegister', { vehicle })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.listItemRow}>
                        <View style={[styles.listItemIcon, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
                          <Ionicons name="car-sport" size={15} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.listItemTitle, { color: colors.text }]} numberOfLines={1}>
                            {vehicle.nickname || vehicle.licence_plate}
                          </Text>
                          <Text style={[styles.listItemSub, { color: colors.textSecondary }]} numberOfLines={1}>
                            {vehicle.make} · {vehicle.model}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={13} color={colors.textMuted} />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            {/* History */}
            <View style={[
              styles.sideCard,
              {
                backgroundColor: colors.surfaceSecondary,
                borderColor: colors.amberBg,
                ...colors.cardShadow,
              },
            ]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: colors.amberBg }]}>
                    <Ionicons name="time" size={14} color={colors.amber} />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>History</Text>
                </View>
                <Text style={[styles.cardCount, { color: colors.textMuted }]}>{permits.length}</Text>
              </View>

              <ScrollView
                style={styles.cardScroll}
                contentContainerStyle={styles.cardScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {permits.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={28} color={colors.textMuted} />
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                      Your past registrations will appear here
                    </Text>
                  </View>
                ) : (
                  permits.map((permit) => {
                    const matched = findVehicleForPermit(vehicles, permit);
                    const isActive = permit.is_active === 1;
                    return (
                      <TouchableOpacity
                        key={permit.id}
                        style={[
                          styles.listItem,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            ...colors.cardShadow,
                          },
                        ]}
                        onPress={() => navigation.navigate('History', { permit })}
                        activeOpacity={0.7}
                      >
                        <View style={styles.listItemRow}>
                          <View style={[
                            styles.listItemIcon,
                            isActive
                              ? { backgroundColor: colors.greenBg, borderColor: colors.greenBorder }
                              : { backgroundColor: colors.amberBg, borderColor: 'transparent' },
                          ]}>
                            <Ionicons
                              name="time"
                              size={13}
                              color={isActive ? colors.green : colors.amber}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.historyItemTop}>
                              <Text style={[styles.listItemTitle, { color: colors.text }]} numberOfLines={1}>
                                {matched?.nickname || permit.licence_plate}
                              </Text>
                              {isActive && (
                                <View style={[styles.activeDot, { backgroundColor: colors.green }]} />
                              )}
                            </View>
                            <Text style={[styles.listItemSub, { color: colors.textSecondary }]} numberOfLines={1}>
                              {formatHistoryDate(permit.issue_date)} · {permit.make} {permit.model}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={12} color={colors.textMuted} />
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  dashboard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Hero scroll — only rendered when there are multiple active permits */
  heroScroll: {
    flexGrow: 0,
  },
  currentCard: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 0,
  },
  sideCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    minHeight: 0,
    marginBottom:14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
  },
  cardCount: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
  },
  currentBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentInfo: {
    flex: 1,
    paddingRight: 12,
  },
  vehicleName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  plateText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  timerRing: {
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  timerLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    marginTop: 2,
  },
  /* Debug button — only visible in __DEV__ builds */
  debugButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  listItem: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  listItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },
  listItemSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  historyItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
