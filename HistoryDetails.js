import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';

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

export default function HistoryDetail({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const db = useSQLiteContext();

  // Permit passed from HomeScreen history list
  const permit = route?.params?.permit ?? null;

  const isActive = permit?.is_active === 1;

  const handleDelete = async () => {
    if (!permit?.id) {
      Alert.alert('Error', 'No permit selected.');
      return;
    }
    Alert.alert(
      'Delete Record',
      'Remove this permit from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM permits WHERE id = ?', [permit.id]);
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Could not delete permit.');
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded) return null;

  const rows = [
    { icon: 'card-outline', label: 'License Plate', value: permit?.licence_plate },
    { icon: 'location-outline', label: 'State', value: permit?.licence_state },
    { icon: 'car-outline', label: 'Make', value: permit?.make },
    { icon: 'construct-outline', label: 'Model', value: permit?.model },
    { icon: 'color-palette-outline', label: 'Color', value: permit?.color },
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
            <Text style={styles.headerTitle}>Permit Detail</Text>
            <Text style={styles.headerSubtitle}>
              {permit?.licence_plate ?? 'Permit history'}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: isActive ? 'rgba(76,217,100,0.15)' : 'rgba(255,255,255,0.07)' }]}>
            <View style={[styles.statusDot, { backgroundColor: isActive ? '#4cd964' : '#8e8e93' }]} />
            <Text style={[styles.statusText, { color: isActive ? '#4cd964' : '#8e8e93' }]}>
              {isActive ? 'Active' : 'Expired'}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBadge}>
                <Ionicons name="document-text-outline" size={15} color="#fbbf24" />
              </View>
              <Text style={styles.cardTitle}>Permit Information</Text>
            </View>

            {rows.map(({ icon, label, value }, i) => (
              <View key={label} style={[styles.row, i === rows.length - 1 && styles.rowLast]}>
                <View style={styles.rowLeft}>
                  <Ionicons name={icon} size={14} color="rgba(165,180,252,0.6)" />
                  <Text style={styles.rowLabel}>{label}</Text>
                </View>
                <Text style={styles.rowValue} numberOfLines={1}>{value ?? '—'}</Text>
              </View>
            ))}
          </View>

          {/* Delete button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={16} color="#f87171" />
            <Text style={styles.deleteText}>Delete From History</Text>
          </TouchableOpacity>
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
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: 'Poppins_700Bold' },
  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32, gap: 14 },
  /* Card */
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.2)',
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
    backgroundColor: 'rgba(251,191,36,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  /* Rows */
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
  /* Delete */
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  deleteText: {
    color: '#f87171',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
});
