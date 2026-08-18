import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
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

export default function HistoryDetail({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const { colors } = useTheme();
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Permit Detail</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
              {permit?.licence_plate ?? 'Permit history'}
            </Text>
          </View>
          <View style={[styles.statusPill, {
            backgroundColor: isActive ? colors.greenBg : colors.surfaceSecondary,
          }]}>
            <View style={[styles.statusDot, { backgroundColor: isActive ? colors.green : colors.iconMuted }]} />
            <Text style={[styles.statusText, { color: isActive ? colors.green : colors.iconMuted }]}>
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
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.amberBg, ...colors.cardShadow }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBadge, { backgroundColor: colors.amberBg }]}>
                <Ionicons name="document-text-outline" size={15} color={colors.amber} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Permit Information</Text>
            </View>

            {rows.map(({ icon, label, value }, i) => (
              <View key={label} style={[styles.row, { borderBottomColor: colors.divider }, i === rows.length - 1 && styles.rowLast]}>
                <View style={styles.rowLeft}>
                  <Ionicons name={icon} size={14} color={inputIconColor} />
                  <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
                </View>
                <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={1}>{value ?? '—'}</Text>
              </View>
            ))}
          </View>

          {/* Delete button */}
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.redBg, borderColor: colors.redBorder }]}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color={colors.red} />
            <Text style={[styles.deleteText, { color: colors.red }]}>Delete From History</Text>
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
  /* Rows */
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
  /* Delete */
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
});
