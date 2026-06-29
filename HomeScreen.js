import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function BottomTabBar({ navigation, active = 'Home' }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { key: 'AddVehicle', icon: 'add', route: 'AddVehicle' },
    { key: 'Home', icon: 'home', route: 'Home' },
    { key: 'Settings', icon: 'settings-outline', route: 'Settings' },
  ];

  return (
    <BlurView intensity={40} tint="dark" style={styles.tabBar}>
      <View style={[styles.tabRow, { paddingBottom: 10 + insets.bottom }]}>
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => {
                if (tab.key !== active) navigation.navigate(tab.route);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={tab.key === 'AddVehicle' ? 26 : 24}
                color={isActive ? '#a5b4fc' : 'rgba(255,255,255,0.45)'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

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
  const [activePermit, setActivePermit] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const vehicleResult = await db.getAllAsync('SELECT * FROM vehicles');
        const permitResult = await db.getAllAsync(
          'SELECT * FROM permits ORDER BY issue_date DESC'
        );
        const activeResult = await db.getAllAsync(
          'SELECT * FROM permits WHERE is_active = 1 ORDER BY expiration_date DESC LIMIT 1'
        );

        setVehicles(vehicleResult);
        setPermits(permitResult);
        setActivePermit(activeResult[0] ?? null);
      };
      loadData();
    }, [db])
  );

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  if (!fontsLoaded) return null;

  const activeVehicle = findVehicleForPermit(vehicles, activePermit);
  const timer = getTimeRemaining(activePermit?.expiration_date);
  const timerColor = timer.expired ? '#ff6b6b' : timer.hasPermit ? '#4cd964' : '#6366f1';

  const displayName =
    activeVehicle?.nickname ||
    activePermit?.licence_plate ||
    vehicles[0]?.nickname ||
    vehicles[0]?.licence_plate ||
    'No vehicle selected';

  const displayMakeModel = activePermit
    ? `${activePermit.make} · ${activePermit.model}`
    : vehicles[0]
      ? `${vehicles[0].make} · ${vehicles[0].model}`
      : 'Add a vehicle to get started';

  const displayPlate = activePermit
    ? `${activePermit.licence_plate} · ${activePermit.licence_state}`
    : vehicles[0]
      ? `${vehicles[0].licence_plate} · ${vehicles[0].licence_state}`
      : null;

  const statusLabel = timer.expired
    ? 'Permit expired'
    : activePermit
      ? 'Protected'
      : 'Not registered';

  const statusColor = timer.expired
    ? 'rgba(255, 107, 107, 0.15)'
    : activePermit
      ? 'rgba(76, 217, 100, 0.15)'
      : 'rgba(255,255,255,0.08)';

  const statusTextColor = timer.expired ? '#ff6b6b' : activePermit ? '#4cd964' : '#8e8e93';

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

          {/* Current Vehicle — hero card */}
          <TouchableOpacity
            style={styles.currentCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('VehicleDetail')}
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
                  {activePermit ? 'Time left' : 'Default'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

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
                      <Text style={styles.listItemTitle} numberOfLines={1}>
                        {vehicle.nickname || vehicle.licence_plate}
                      </Text>
                      <Text style={styles.listItemSub} numberOfLines={1}>
                        {vehicle.make} · {vehicle.model}
                      </Text>
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
                        onPress={() => navigation.navigate('History')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.historyItemTop}>
                          <Text style={styles.listItemTitle} numberOfLines={1}>
                            {matched?.nickname || permit.licence_plate}
                          </Text>
                          {isActive ? (
                            <View style={styles.activeDot} />
                          ) : null}
                        </View>
                        <Text style={styles.listItemSub} numberOfLines={1}>
                          {formatHistoryDate(permit.issue_date)} · {permit.make} {permit.model}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </View>

        <BottomTabBar navigation={navigation} active="Home" />
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
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  listItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  listItemTitle: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },
  listItemSub: {
    color: 'rgba(255,255,255,0.45)',
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
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 32,
  },
  tabButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
});
