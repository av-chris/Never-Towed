import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({navigation}) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <StatusBar style="light" />

      {/* TOP WIDGET */}
      <View style={styles.TopWidget}>
        <TouchableOpacity style={[styles.Widgets, styles.MainWidget]}>
            <View style={styles.MainWidgetTitle}>
                <Text style={styles.MainWidgetLabel}>Current Vehicle</Text>
            </View>
                <View style={styles.MainWidgetInfo}>
                    <View style={styles.InfoBox}>
                        <Text style={styles.NickName}>My Car</Text>
                        <Text style={styles.CarDetail}>Toyota • Camry</Text>
                        <Text style={styles.CarDetail}>2011 • White</Text>
                        <Text style={styles.PlateText}>ABC1234 • TX</Text>
                    </View>
                    <View style={styles.CircularTimer}>
                        <Text style={styles.TimerText}>24:00</Text>
                        <Text style={styles.TimerLabel}>Time Left</Text>
                    </View>
            </View>

        </TouchableOpacity>
      </View>

      {/* BOTTOM WIDGETS */}
      <View style={styles.BottomWidgets}>

        {/* LEFT - VEHICLES */}
        <View style={[styles.Widgets, styles.LeftWidget]}>
          <Text style={styles.WidgetLabel}>Saved Vehicles</Text>
          <View style={styles.QuickVehicles}>
            <TouchableOpacity style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Saved Vehicle NickName 1</Text>
              <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>

            </TouchableOpacity>
             <TouchableOpacity style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Saved Vehicle NickName 2</Text>
              <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>

            </TouchableOpacity>
            <TouchableOpacity style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Saved Vehicle NickName 3</Text>
              <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>

            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.MoreVehicles } onPress={() => navigation.navigate('AddVehicle')}>
            <Ionicons name="add-circle" size={22} color="#8e8e93" />
            <Text style={styles.AddVehicle}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>

        {/* RIGHT - HISTORY */}
        <View style={[styles.Widgets, styles.RightWidget]}>
          <Text style={styles.WidgetLabel}>History</Text>
          <View style={styles.History}>
            <View style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Vehicle NickName 1</Text>
                <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>
              <Text style={styles.VehicleDetail}>Month Day • 24hrs</Text>
            </View>
            <View style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Vehicle NickName 2</Text>
                <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>
              <Text style={styles.VehicleDetail}>Month Day • 24hrs</Text>
            </View>
            <View style={styles.VehicleCard}>
              <Text style={styles.VehicleNick}>Vehicle NickName 3</Text>
                <Text style={styles.VehicleDetail}>Make • PLateNumber</Text>
              <Text style={styles.VehicleDetail}>Model • Year</Text>
              <Text style={styles.VehicleDetail}>Month Day • 24hrs</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.MoreVehicles} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color="#8e8e93" />
            <Text style={styles.AddVehicle}>Settings</Text>
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // TOP WIDGET
  TopWidget: {
    flex: 0.75,
  },

  MainWidget: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: 70,
    marginBottom: 14,
    marginHorizontal: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
    MainWidgetTitle:{
    flex:.5,
  },
  MainWidgetInfo:{
    flexDirection:'row'
  },
  InfoBox: {
    flex: 1,
    paddingLeft: 8,
  },
  NickName: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    marginTop:22,
    marginBottom: 26,
  },
  CarDetail: {
    color: '#8e8e93',
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    marginBottom: 26,
  },
  PlateText: {
    color: '#8e8e93',
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    marginTop: 0,
  },
  CircularTimer: {
    marginTop:60,
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: width * 0.5,
    borderWidth: 8,
    borderColor: '#4cd964',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TimerText: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  TimerLabel: {
    color: '#8e8e93',
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    textAlign: 'center',
  },
  // BOTTOM WIDGETS
  BottomWidgets: {
    flex: 1,
    flexDirection: 'row',
  },
  WidgetLabel: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    marginBottom: 8,
  },
  MainWidgetLabel:{
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
  },

  Widgets: {
    backgroundColor: '#1c1c1e',
  },
  LeftWidget: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 5,
    marginLeft: 15,
    marginBottom: 30,
  },
  RightWidget: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.15)',
    marginLeft: 5,
    marginRight: 15,
    marginBottom: 30,
  },
  QuickVehicles: {
    flex: 1,
  },
  History: {
    flex: 1,
  },
  VehicleCard: {
    flex:1,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },
  VehicleNick: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
  },
  VehicleDetail: {
    color: '#8e8e93',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  MoreVehicles: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    gap: 6,
  },
  AddVehicle: {
    flex:1,
    color: '#8e8e93',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
  icon: {
    marginTop: 35,
    marginLeft: 20,
  },
  Settings: {
    flexDirection: 'row',
  },
  SettingsButton: {
    fontSize: 18,
    marginTop: 35,
    flex:1,
  },
});