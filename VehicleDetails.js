import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeRemaining(expirationDate) {
  if (!expirationDate) return { label: '—', expired: false };
  const end = new Date(expirationDate);
  const now = new Date();
  if (Number.isNaN(end.getTime())) return { label: '—', expired: false };
  const diffMs = end - now;
  if (diffMs <= 0) return { label: 'Expired', expired: true };
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { label: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`, expired: false };
}

export default function VehicleDetailScreen({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  const permit = route?.params?.permit ?? null;
  const vehicle = route?.params?.vehicle ?? null;

  const isActive = permit?.is_active === 1;
  const timer = getTimeRemaining(permit?.expiration_date);
  const timerColor = timer.expired ? '#ff6b6b' : isActive ? '#4cd964' : '#6366f1';

  if (!fontsLoaded) return null;

  const vehicleRows = [
    { icon: 'pricetag-outline', label: 'Nickname', value: vehicle?.nickname || permit?.licence_plate },
    { icon: 'card-outline', label: 'License Plate', value: permit?.licence_plate ?? vehicle?.licence_plate },
    { icon: 'location-outline', label: 'State', value: permit?.licence_state ?? vehicle?.licence_state },
    { icon: 'car-outline', label: 'Make', value: permit?.make ?? vehicle?.make },
    { icon: 'construct-outline', label: 'Model', value: permit?.model ?? vehicle?.model },
    { icon: 'color-palette-outline', label: 'Color', value: permit?.color ?? vehicle?.color },
  ];

  const permitRows = [
    { icon: 'calendar-outline', label: 'Issued', value: formatDate(permit?.issue_date) },
    { icon: 'timer-outline', label: 'Expires', value: formatDate(permit?.expiration_date) },
  ];

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Current Vehicle</Text>
            <Text style={styles.headerSubtitle}>
              {vehicle?.nickname || permit?.licence_plate || 'No vehicle'}
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="car-sport" size={18} color="#a5b4fc" />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer hero card */}
          {permit && (
            <View style={styles.heroCard}>
              <View style={styles.heroLeft}>
                <View style={[styles.statusPill, { backgroundColor: isActive ? 'rgba(76,217,100,0.15)' : 'rgba(255,107,107,0.12)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? '#4cd964' : '#ff6b6b' }]} />
                  <Text style={[styles.statusText, { color: isActive ? '#4cd964' : '#ff6b6b' }]}>
                    {isActive ? 'Protected' : 'Permit expired'}
                  </Text>
                </View>
                <Text style={styles.heroLabel}>Time remaining</Text>
                <Text style={[styles.heroTimer, { color: timerColor }]}>{timer.label}</Text>
              </View>
              <View style={[styles.timerRing, { borderColor: timerColor }]}>
                <Ionicons name="shield-checkmark" size={28} color={timerColor} />
              </View>
            </View>
          )}

          {/* Vehicle info card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="car-sport" size={15} color="#a5b4fc" />
              </View>
              <Text style={styles.cardTitle}>Vehicle Info</Text>
            </View>
            {vehicleRows.map(({ icon, label, value }, i) => (
              <View key={label} style={[styles.row, i === vehicleRows.length - 1 && styles.rowLast]}>
                <View style={styles.rowLeft}>
                  <Ionicons name={icon} size={14} color="rgba(165,180,252,0.6)" />
                  <Text style={styles.rowLabel}>{label}</Text>
                </View>
                <Text style={styles.rowValue} numberOfLines={1}>{value ?? '—'}</Text>
              </View>
            ))}
          </View>

          {/* Permit dates card — only shown when there's an active permit */}
          {permit && (
            <View style={[styles.card, { borderColor: 'rgba(76,217,100,0.18)' }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(76,217,100,0.12)' }]}>
                  <Ionicons name="document-text-outline" size={15} color="#4cd964" />
                </View>
                <Text style={styles.cardTitle}>Active Permit</Text>
              </View>
              {permitRows.map(({ icon, label, value }, i) => (
                <View key={label} style={[styles.row, i === permitRows.length - 1 && styles.rowLast]}>
                  <View style={styles.rowLeft}>
                    <Ionicons name={icon} size={14} color="rgba(165,180,252,0.6)" />
                    <Text style={styles.rowLabel}>{label}</Text>
                  </View>
                  <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {!permit && (
            <View style={styles.emptyCard}>
              <Ionicons name="document-outline" size={32} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>No active permit.{'\n'}Register this vehicle to protect it.</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('AddVehicle')}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 26,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  headerBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(99,102,241,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  /* Hero timer card */
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: { flex: 1 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: 'Poppins_700Bold' },
  heroLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  heroTimer: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    marginTop: 2,
  },
  timerRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  /* Info card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.18)',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(99,102,241,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rowLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  rowValue: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    maxWidth: '55%',
    textAlign: 'right',
  },
  /* Empty state */
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: 'rgba(99,102,241,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.5)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
  },
});
