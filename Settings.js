import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from './ThemeContext';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {



  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const { colors, preference, setPreference } = useTheme();

  const [AccountOpen, setAccountOpen] = useState(false);
  const [NotificationOpen, setNotificationOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('5 Minutes before');
  const [ThemeOpen, setThemeOpen] = useState(false);
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
  useEffect(() => {
    async function loadSavedStatus() {
      const raw = await AsyncStorage.getItem('status');
      const saved = JSON.parse(raw)
      setNotificationsEnabled(saved); // or however you want to interpret it
    }
    loadSavedStatus();
  }, []);

  if (!fontsLoaded) return null;

  const cardStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...colors.cardShadow,
  };

async function handleNotifications( wantsEnabled){

if(wantsEnabled){
const {status, canAskAgain} = await Notifications.requestPermissionsAsync();
if (status === 'granted'){
setNotificationsEnabled(true)
          await AsyncStorage.setItem('status', JSON.stringify(true));

}
if( status === 'denied' || !canAskAgain){
Alert.alert(
'Notifications Disabled',
'You previously denied notification permissions. Enable them in Settings to use this feature.',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Open Settings', onPress: () => Linking.openSettings() },
  ]
);
    setNotificationsEnabled(false)
    await AsyncStorage.setItem('status', JSON.stringify(false));

}



  }else{

  setNotificationsEnabled(false);
  await AsyncStorage.setItem('status', JSON.stringify(false));
  await Notifications.cancelAllScheduledNotificationsAsync();
}
}


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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>Manage your preferences</Text>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: colors.headerBadgeBg, borderColor: colors.headerBadgeBorder }]}>
            <Ionicons name="settings-outline" size={18} color={colors.accent} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Card */}
          <View style={[styles.card, cardStyle]}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setAccountOpen(!AccountOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: colors.accentBg }]}>
                <Ionicons name="person-outline" size={16} color={colors.accent} />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Account</Text>
              <Ionicons
                name={AccountOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.textTertiary}
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {AccountOpen && (
              <View style={styles.cardDropdown}>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={14} color={colors.accent} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>Email: example@email.com</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="car-outline" size={14} color={colors.accent} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>Parking System: Example System</Text>
                </View>
              </View>
            )}
          </View>

          {/* Notifications Card */}
          <View style={[styles.card, cardStyle]}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setNotificationOpen(!NotificationOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(196,181,253,0.15)' }]}>
                <Ionicons name="notifications-outline" size={16} color="#c4b5fd" />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Notifications</Text>
              <Ionicons
                name={NotificationOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.textTertiary}
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {NotificationOpen && (
              <View style={styles.cardDropdown}>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() =>  handleNotifications(!notificationsEnabled)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={notificationsEnabled ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.accent}
                  />
                  <Text style={[styles.checkLabel, { color: colors.text }]}>Enable Notifications</Text>
                </TouchableOpacity>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  When should NeverTowed remind you before your parking permit expires?
                </Text>
                {['5 Minutes before', '10 Minutes before', '30 Minutes before', '1 Hour before'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.checkRow}
                    onPress={() => setNotificationTime(time)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={notificationTime === time ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={[styles.checkLabel, { color: colors.textSecondary }]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Appearance Card */}
          <View style={[styles.card, cardStyle]}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setThemeOpen(!ThemeOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(167,243,208,0.15)' }]}>
                <Ionicons name="contrast-outline" size={16} color="#6ee7b7" />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Light / Dark Mode</Text>
              <Ionicons
                name={ThemeOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.textTertiary}
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {ThemeOpen && (
              <View style={styles.cardDropdown}>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                {/* preference values match ThemeContext: 'Dark' | 'Light' | 'System' */}
                {[
                  { value: 'Dark',   label: 'Dark'            },
                  { value: 'Light',  label: 'Light'           },
                  { value: 'System', label: 'System Settings' },
                ].map(({ value, label }) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.checkRow}
                    onPress={() => setPreference(value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={preference === value ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={[styles.checkLabel, { color: colors.textSecondary }]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Local Data Card */}
          <View style={[styles.card, cardStyle]}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => setDataOpen(!DataOpen)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBadge, { backgroundColor: 'rgba(252,165,165,0.12)' }]}>
                <Ionicons name="trash-outline" size={16} color="#fca5a5" />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>Local Data</Text>
              <Ionicons
                name={DataOpen ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.textTertiary}
                style={styles.cardChevron}
              />
            </TouchableOpacity>
            {DataOpen && (
              <View style={styles.cardDropdown}>
                <View style={[styles.divider, { backgroundColor: colors.divider }]} />
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
          <View style={[
            styles.card,
            styles.logoutCard,
            { backgroundColor: colors.surface, ...colors.cardShadow },
          ]}>
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
  container: { flex: 1 },
  safeArea: { flex: 1 },
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 28,
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
  /* ── Scroll ── */
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  /* ── Cards ── */
  card: {
    borderRadius: 18,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  cardChevron: { marginLeft: 'auto' },
  cardDropdown: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
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
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  sectionLabel: {
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
  logoutCard: { borderColor: 'rgba(248,113,113,0.25)' },
  logoutLabel: {
    flex: 1,
    color: '#f87171',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});
