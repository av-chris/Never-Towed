import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const [AccountOpen, setAccountOpen] = useState(false);
  const [NotificationOpen, setNotificationOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('30 minutes before');
  const [ThemeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState('Dark');
  const [DataOpen, setDataOpen] = useState(false);
  const [data, setData] = useState('');

  const db = useSQLiteContext();

  const handleData = async () => {
    async function DeleteSaved() {
      await db.runAsync('DELETE FROM vehicles');
      const SavedResult = await db.getAllAsync('Select * FROM vehicles');
      console.log('VEHICLES IN DATABASE:', SavedResult);
    }
    async function DeleteHistory() {
      await db.runAsync('DELETE FROM permits');
      const PermitResult = await db.getAllAsync('SELECT * FROM permits');
      console.log('PERMITS IN DATABASE:', PermitResult);
    }
    try {
      if (data === 'Delete all Saved Vehicles') {
        await DeleteSaved();
        Alert.alert('Success', 'All Saved Vehicle Data deleted successfully!');
      } else if (data === 'Delete all Permit History') {
        await DeleteHistory();
        Alert.alert('Success', 'All Vehicle Permit History deleted successfully!');
      } else if (data === 'Delete all Local Data') {
        await DeleteSaved();
        await DeleteHistory();
        Alert.alert('Success', 'All Local History deleted successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your preferences</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="settings-outline" size={18} color="#a5b4fc" />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setAccountOpen(!AccountOpen)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconBadge}>
                <Ionicons name="person-outline" size={16} color="#a5b4fc" />
              </View>
              <Text style={styles.cardLabel}>Account</Text>
              <Ionicons
                name={AccountOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {AccountOpen && (
              <View style={styles.cardDropdown}>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={14} color="#a5b4fc" />
                  <Text style={styles.infoText}>Email: example@email.com</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="car-outline" size={14} color="#a5b4fc" />
                  <Text style={styles.infoText}>Parking System: Example System</Text>
                </View>
              </View>
            )}
          </View>

          {/* Notifications Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setNotificationOpen(!NotificationOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(196,181,253,0.15)' }]}>
                <Ionicons name="notifications-outline" size={16} color="#c4b5fd" />
              </View>
              <Text style={styles.cardLabel}>Notifications</Text>
              <Ionicons
                name={NotificationOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {NotificationOpen && (
              <View style={styles.cardDropdown}>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={notificationsEnabled ? 'checkbox' : 'square-outline'}
                    size={20}
                    color="#a5b4fc"
                  />
                  <Text style={styles.checkLabel}>Enable Notifications</Text>
                </TouchableOpacity>
                <Text style={styles.sectionLabel}>
                  When should NeverTowed remind you before your parking permit expires?
                </Text>
                {['30 minutes before', '1 hour before', '2 hours before', '3 hours before'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.checkRow}
                    onPress={() => setNotificationTime(time)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={notificationTime === time ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color="#a5b4fc"
                    />
                    <Text style={styles.checkLabel}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Appearance Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setThemeOpen(!ThemeOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(167,243,208,0.12)' }]}>
                <Ionicons name="contrast-outline" size={16} color="#6ee7b7" />
              </View>
              <Text style={styles.cardLabel}>Light / Dark Mode</Text>
              <Ionicons
                name={ThemeOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {ThemeOpen && (
              <View style={styles.cardDropdown}>
                <View style={styles.divider} />
                {['Dark', 'Light', 'System Settings'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.checkRow}
                    onPress={() => setTheme(option)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={theme === option ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color="#a5b4fc"
                    />
                    <Text style={styles.checkLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Local Data Card */}
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setDataOpen(!DataOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(252,165,165,0.12)' }]}>
                <Ionicons name="trash-outline" size={16} color="#fca5a5" />
              </View>
              <Text style={styles.cardLabel}>Local Data</Text>
              <Ionicons
                name={DataOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="rgba(255,255,255,0.4)"
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {DataOpen && (
              <View style={styles.cardDropdown}>
                <View style={styles.divider} />
                {['Delete all Saved Vehicles', 'Delete all Permit History', 'Delete all Local Data'].map(
                  (DataOption) => (
                    <TouchableOpacity
                      key={DataOption}
                      style={styles.checkRow}
                      onPress={() => setData(DataOption)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={data === DataOption ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color="#fca5a5"
                      />
                      <Text style={styles.dataOptionText}>{DataOption}</Text>
                    </TouchableOpacity>
                  )
                )}
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleData()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Log Out Card */}
          <View style={[styles.card, styles.logoutCard]}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(248,113,113,0.15)' }]}>
                <Ionicons name="log-out-outline" size={16} color="#f87171" />
              </View>
              <Text style={styles.logoutLabel}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 28,
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
  /* ── Scroll ── */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  /* ── Cards ── */
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.18)',
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(99,102,241,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  cardChevron: {
    marginLeft: 'auto',
  },
  cardDropdown: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 12,
  },
  /* ── Dropdown rows ── */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  infoText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  checkLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  dataOptionText: {
    color: '#fca5a5',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  confirmButton: {
    marginTop: 14,
    backgroundColor: 'rgba(248,113,113,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#f87171',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  /* ── Log Out ── */
  logoutCard: {
    borderColor: 'rgba(248,113,113,0.25)',
  },
  logoutLabel: {
    flex: 1,
    color: '#f87171',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});
