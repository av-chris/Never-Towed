import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import VehicleDetail from './VehicleDetails';

export default function HistoryDetail({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.MainScreen}>
        <View style={styles.Header}>
          <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Vehicle History</Text>
        </View>

        <View style={styles.MainContent}>

          {/* Account */}
          <View style={styles.ContentTab} >
            <Text style={styles.ContentText}>NickName:</Text>
            <Text style={styles.VehicleHistory}>My Car</Text>
          </View>


          {/* License Plate */}
          <View style={styles.ContentTab} >
            <Text style={styles.ContentText}>License Plate:</Text>
            <Text style={styles.VehicleHistory}>ABC1234</Text>
          </View>


          {/* License State */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>License State:</Text>
            <Text style={styles.VehicleHistory}>TX</Text>
          </View>

          {/* Make */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Make:</Text>
            <Text style={styles.VehicleHistory}>Lexus</Text>
          </View>

          {/* Model */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Model:</Text>
            <Text style={styles.VehicleHistory}>LS400</Text>
          </View>

          {/* Year */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Year:</Text>
            <Text style={styles.VehicleHistory}>1992</Text>
          </View>

          {/* Color */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Color:</Text>
            <Text style={styles.VehicleHistory}>Black</Text>
          </View>

          {/* Date Start */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Registration Start:</Text>
            <Text style={styles.VehicleHistory}>Year-Month-Day 00:00</Text>
          </View>



          {/* Date End */}
          <View style={styles.ContentTab}>
            <Text style={styles.ContentText}>Registration End:</Text>
            <Text style={styles.VehicleHistory}>Year-Month-Day 00:00</Text>
          </View>
          


          {/* Delete */}
          <TouchableOpacity style={[styles.ContentTab, styles.LogOut]} onPress={() => navigation.goBack()}>
            <Text style={styles.LogOutText}>Delete From History</Text>
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
    fontSize: 30,
    fontFamily: 'Poppins_400Regular',
  },
  MainContent: {
    paddingHorizontal: 10,
  },
  ContentTab: {
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ContentText: {
    color: '#ffffffb2',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flex:.87,

  },
  VehicleHistory:{
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flex:1,
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
  });