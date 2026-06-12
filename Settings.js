import { StyleSheet, Text, View, TouchableOpacity,ScrollView,Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export default function SettingsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const [AccountOpen, setAccountOpen] = useState(false);
  const [NotificationOpen, setNotificationOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('30 minutes before');
  const [ThemeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState('Dark');
  const [DataOpen, setDataOpen] = useState(false);
  const [data, setData] = useState('')

  const db = useSQLiteContext();


  const handleData = async() =>{

async function DeleteSaved(){
await db.runAsync('DELETE FROM vehicles')
  const SavedResult = await db.getAllAsync('Select * FROM vehicles')
console.log('VEHICLES IN DATABASE:',SavedResult)
}
async function DeleteHistory(){
await db.runAsync('DELETE FROM permits')
  const PermitResult = await db.getAllAsync('SELECT * FROM permits');
  console.log('PERMITS IN DATABASE:',PermitResult)

}
try{
if(data === 'Delete all Saved Vehicles'){
await DeleteSaved();
  Alert.alert('Success', 'All Saved Vehicle Data deleted successfully!');
}
else if(data === 'Delete all Permit History'){
await DeleteHistory();
  Alert.alert('Success', 'All Vehicle Permit History deleted successfully!');
}
else if(data === 'Delete all Local Data'){
await DeleteSaved();
await DeleteHistory();
  Alert.alert('Success', 'All Local History deleted successfully!');
}
}
catch(error){
  console.error(error);
  Alert.alert('Error', 'An error occurred');
}
  }

  
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    
      <View style={styles.MainScreen}>
        <View style={styles.Header}>
          <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Settings</Text>
        </View>

        <View style={styles.MainContent}>

          {/* Account */}
          <TouchableOpacity style={styles.ContentTab} onPress={() => setAccountOpen(!AccountOpen)}>
            <Text style={styles.ContentText}>Account</Text>
            <Ionicons name={AccountOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="#ffffff" />
          </TouchableOpacity>
          {AccountOpen && (
            <View style={styles.DropdownContent}>
              <Text style={styles.DropdownText}>Email: example@email.com</Text>
              <Text style={styles.DropdownText}>Parking System: Example System</Text>
            </View>
          )}

          {/* Notifications */}
          <TouchableOpacity style={styles.ContentTab} onPress={() => setNotificationOpen(!NotificationOpen)}>
            <Text style={styles.ContentText}>Notifications</Text>
            <Ionicons name={NotificationOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="#ffffff" />
          </TouchableOpacity>
          {NotificationOpen && (
            <View style={styles.DropdownContent}>
              <TouchableOpacity style={styles.CheckboxRow} onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
                <Ionicons name={notificationsEnabled ? 'checkbox' : 'square-outline'} size={22} color="#ffffff" />
                <Text style={styles.DropdownText}>Enable Notifications</Text>
              </TouchableOpacity>
              <Text style={styles.DropdownLabel}>When should NeverTowed remind you before your parking permit expires?</Text>
              {['30 minutes before', '1 hour before', '2 hours before', '3 hours before'].map((time) => (
                <TouchableOpacity key={time} style={styles.CheckboxRow} onPress={() => setNotificationTime(time)}>
                  <Ionicons name={notificationTime === time ? 'radio-button-on' : 'radio-button-off'} size={22} color="#ffffff" />
                  <Text style={styles.DropdownText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Light/Dark Mode */}
          <TouchableOpacity style={styles.ContentTab} onPress={() => setThemeOpen(!ThemeOpen)}>
            <Text style={styles.ContentText}>Light/Dark Mode</Text>
            <Ionicons name={ThemeOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="#ffffff" />
          </TouchableOpacity>
          {ThemeOpen && (
            <View style={styles.DropdownContent}>
              {['Dark', 'Light', 'System Settings'].map((option) => (
                <TouchableOpacity key={option} style={styles.CheckboxRow} onPress={() => setTheme(option)}>
                  <Ionicons name={theme === option ? 'radio-button-on' : 'radio-button-off'} size={22} color="#ffffff" />
                  <Text style={styles.DropdownText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
            {/* Local Data */}
          <TouchableOpacity style={styles.ContentTab} onPress={() => setDataOpen(!DataOpen)}>
            <Text style={styles.ContentText}>Local Data</Text>
            <Ionicons name={DataOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="#ffffff" />
          </TouchableOpacity>
          {DataOpen && (
            <View style={styles.DropdownContent}>
            {['Delete all Saved Vehicles','Delete all Permit History','Delete all Local Data'].map((DataOption) => (
                <TouchableOpacity key={DataOption} style={styles.CheckboxRow} onPress={() => setData(DataOption)}>
                  <Ionicons name={data === DataOption ? 'radio-button-on' : 'radio-button-off'} size={22} color="#ffa49f" />
                  <Text style={styles.DataText}>{DataOption}</Text>
                </TouchableOpacity>
            ))}
              <TouchableOpacity style={[styles.ContentTab, styles.LogOut]} onPress={() => handleData()}>
              <Text style={styles.LogOutText}>Confirm</Text>
              </TouchableOpacity>

            </View>
          )}


          {/* Log Out */}
          <TouchableOpacity style={[styles.ContentTab, styles.LogOut]} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
            <Text style={styles.LogOutText}>Log Out</Text>
          </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MainScreen: {
    marginTop: 60,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    margin: 20,
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',

  },
  Header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  BackButton: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  HeaderText: {
    color: '#ffffff',
    fontSize: 40,
    fontFamily: 'Poppins_400Regular',
  },
  MainContent: {
    paddingHorizontal: 10,
  },
  ContentTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ContentText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  DropdownContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  DropdownText: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: 4,
  },
  DropdownLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 12,
    marginBottom: 6,
  },
  CheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  LogOut: {
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  LogOutText: {
    color: '#ff453a',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  DataText: {
    color: '#ffa49f',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
});