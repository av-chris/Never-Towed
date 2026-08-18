import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from './ThemeContext';

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
  const { colors } = useTheme();

  const permit = route?.params?.permit ?? null;
  const vehicle = route?.params?.vehicle ?? null;

  const isActive = permit?.is_active === 1;
  const timer = getTimeRemaining(permit?.expiration_date);
  const timerColor = timer.expired ? colors.timerExpired : isActive ? colors.timerProtected : colors.timerDefault;

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

  const inputIconColor = colors.accent + '99';

  return (
    <LinearGradient colors={colors.gradientBg} style={styles.container}>
      <StatusBar style={colors.statusBar} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.backButtonBg, borderColor: colors.backButtonBorder }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Current Vehicle</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
              {vehicle?.nickname || permit?.licence_plate || 'No vehicle'}
            </Text>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: colors.headerBadgeBg, borderColor: colors.headerBadgeBorder }]}>
            <Ionicons name="car-sport" size={18} color={colors.accent} />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer hero card */}
          {permit && (
            <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.borderAccent, ...colors.cardShadow }]}>
              <View style={styles.heroLeft}>
                <View style={[styles.statusPill, { backgroundColor: isActive ? colors.greenBg : colors.redBg }]}>
                  <View style={[styles.statusDot, { backgroundColor: isActive ? colors.green : colors.red }]} />
                  <Text style={[styles.statusText, { color: isActive ? colors.green : colors.red }]}>
                    {isActive ? 'Protected' : 'Permit expired'}
                  </Text>
                </View>
                <Text style={[styles.heroLabel, { color: colors.textTertiary }]}>Time remaining</Text>
                <Text style={[styles.heroTimer, { color: timerColor }]}>{timer.label}</Text>
              </View>
              <View style={[styles.timerRing, { borderColor: timerColor, backgroundColor: colors.timerRingBg }]}>
                <Ionicons name="shield-checkmark" size={28} color={timerColor} />
              </View>
            </View>
          )}

          {/* Vehicle info card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, ...colors.cardShadow }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBadge, { backgroundColor: colors.accentBg }]}>
                <Ionicons name="car-sport" size={15} color={colors.accent} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Vehicle Info</Text>
            </View>
            {vehicleRows.map(({ icon, label, value }, i) => (
              <View key={label} style={[styles.row, { borderBottomColor: colors.divider }, i === vehicleRows.length - 1 && styles.rowLast]}>
                <View style={styles.rowLeft}>
                  <Ionicons name={icon} size={14} color={inputIconColor} />
                  <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
                </View>
                <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={1}>{value ?? '—'}</Text>
              </View>
            ))}
          </View>

          {/* Permit dates card — only shown when there's an active permit */}
          {permit && (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.greenBorder, ...colors.cardShadow }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBadge, { backgroundColor: colors.greenBg }]}>
                  <Ionicons name="document-text-outline" size={15} color={colors.green} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Active Permit</Text>
              </View>
              {permitRows.map(({ icon, label, value }, i) => (
                <View key={label} style={[styles.row, { borderBottomColor: colors.divider }, i === permitRows.length - 1 && styles.rowLast]}>
                  <View style={styles.rowLeft}>
                    <Ionicons name={icon} size={14} color={inputIconColor} />
                    <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
                  </View>
                  <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={2}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {!permit && (
            <View style={[styles.emptyCard, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Ionicons name="document-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No active permit.{'\n'}Register this vehicle to protect it.</Text>
              <TouchableOpacity
                style={[styles.registerButton, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}
                onPress={() => navigation.navigate('AddVehicle')}
                activeOpacity={0.8}
              >
                <Text style={[styles.registerButtonText, { color: colors.accent }]}>Register Now</Text>
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 26,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  headerBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  /* Hero timer card */
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
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
  },
  /* Info card */
  card: {
    borderRadius: 20,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
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
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    maxWidth: '55%',
    textAlign: 'right',
  },
  /* Empty state */
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  registerButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  registerButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
  },
});
