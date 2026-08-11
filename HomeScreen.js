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
    const timerColor = timer.expired ? '#ff6b6b' : timer.hasPermit ? '#4cd964' : '#6366f1';

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

    const statusColor = timer.expired
      ? 'rgba(255, 107, 107, 0.15)'
      : permit
        ? 'rgba(76, 217, 100, 0.15)'
        : 'rgba(255,255,255,0.08)';

    const statusTextColor = timer.expired ? '#ff6b6b' : permit ? '#4cd964' : '#8e8e93';

    return (
      <TouchableOpacity
        key={permit?.id ?? 'empty'}
        style={[styles.currentCard, extraStyle]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('VehicleDetail', { permit, vehicle })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.cardIconBadge, styles.currentBadge]}>
              <Ionicons name="car-sport" size={16} color="#a5b4fc" />
            </View>
            <Text style={styles.cardTitle}>Current Vehicle</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusTextColor }]} />
            <Text style={[styles.statusText, { color: statusTextColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.currentBody}>
          <View style={styles.currentInfo}>
            <Text style={styles.vehicleName}>{displayName}</Text>
            <Text style={styles.vehicleDetail}>{displayMakeModel}</Text>
            {displayPlate ? (
              <View style={styles.plateRow}>
                <Ionicons name="card-outline" size={14} color="#8e8e93" />
                <Text style={styles.plateText}>{displayPlate}</Text>
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.timerRing,
              {
                borderColor: timerColor,
                width: width * 0.26,
                height: width * 0.26,
                borderRadius: (width * 0.26) / 2,
              },
            ]}
          >
            <Text style={styles.timerText}>{timer.label}</Text>
            <Text style={styles.timerLabel}>
              {permit ? 'Time left' : 'Default'}
            </Text>
          </View>
        </View>

        {/* Debug-only button to clear active status — never shown in production */}
        {__DEV__ && permit && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => handleDebugClear(permit)}
            activeOpacity={0.7}
          >
            <Text style={styles.debugText}>Debug: Clear</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.dashboard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Never Towed</Text>
              <Text style={[styles.subGreeting, { maxWidth: width * 0.72 }]}>
                Keep your car protected from surprise tows
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="shield-checkmark" size={22} color="#a5b4fc" />
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
            <View style={[styles.sideCard, styles.savedCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardIconBadge, styles.savedBadge]}>
                    <Ionicons name="bookmark" size={14} color="#c4b5fd" />
                  </View>
                  <Text style={styles.cardTitle}>Saved Vehicles</Text>
                </View>
                <Text style={styles.cardCount}>{vehicles.length}</Text>
              </View>

              <ScrollView
                style={styles.cardScroll}
                contentContainerStyle={styles.cardScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {vehicles.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="car-outline" size={28} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.emptyText}>Save your car to register in one tap</Text>
                  </View>
                ) : (
                  vehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={styles.listItem}
                      onPress={() => navigation.navigate('QuickRegister', { vehicle })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.listItemRow}>
                        <View style={styles.listItemIcon}>
                          <Ionicons name="car-sport" size={15} color="#a5b4fc" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.listItemTitle} numberOfLines={1}>
                            {vehicle.nickname || vehicle.licence_plate}
                          </Text>
                          <Text style={styles.listItemSub} numberOfLines={1}>
                            {vehicle.make} · {vehicle.model}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={13} color="rgba(255,255,255,0.25)" />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>

            {/* History */}
            <View style={[styles.sideCard, styles.historyCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardIconBadge, styles.historyBadge]}>
                    <Ionicons name="time" size={14} color="#fbbf24" />
                  </View>
                  <Text style={styles.cardTitle}>History</Text>
                </View>
                <Text style={styles.cardCount}>{permits.length}</Text>
              </View>

              <ScrollView
                style={styles.cardScroll}
                contentContainerStyle={styles.cardScrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {permits.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="document-text-outline" size={28} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.emptyText}>Your past registrations will appear here</Text>
                  </View>
                ) : (
                  permits.map((permit) => {
                    const matched = findVehicleForPermit(vehicles, permit);
                    const isActive = permit.is_active === 1;
                    return (
                      <TouchableOpacity
                        key={permit.id}
                        style={styles.listItem}
                        onPress={() => navigation.navigate('History', { permit })}
                        activeOpacity={0.7}
                      >
                        <View style={styles.listItemRow}>
                          <View style={[styles.listItemIcon, isActive && styles.listItemIconActive]}>
                            <Ionicons name="time" size={13} color={isActive ? '#4cd964' : '#fbbf24'} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={styles.historyItemTop}>
                              <Text style={styles.listItemTitle} numberOfLines={1}>
                                {matched?.nickname || permit.licence_plate}
                              </Text>
                              {isActive && <View style={styles.activeDot} />}
                            </View>
                            <Text style={styles.listItemSub} numberOfLines={1}>
                              {formatHistoryDate(permit.issue_date)} · {permit.make} {permit.model}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.2)" />
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
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    minHeight: 0,
  },
  savedCard: {
    borderColor: 'rgba(196, 181, 253, 0.2)',
  },
  historyCard: {
    borderColor: 'rgba(251, 191, 36, 0.15)',
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
  currentBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  savedBadge: {
    backgroundColor: 'rgba(196, 181, 253, 0.15)',
  },
  historyBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },
  cardCount: {
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
    color: 'rgba(255,255,255,0.35)',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  vehicleDetail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.6)',
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
    color: '#8e8e93',
  },
  timerRing: {
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  timerText: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  timerLabel: {
    color: '#8e8e93',
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
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  debugText: {
    color: 'rgba(255,255,255,0.4)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.18)',
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
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemIconActive: {
    backgroundColor: 'rgba(76,217,100,0.15)',
    borderColor: 'rgba(76,217,100,0.25)',
  },
  listItemTitle: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },
  listItemSub: {
    color: 'rgba(255,255,255,0.5)',
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
    backgroundColor: '#4cd964',
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
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
