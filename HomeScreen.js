import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,Dimensions } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;
  return (

    <View style={styles.container}>
        <View style={styles.TopWidget}>
            <View style={[styles.Widgets ,styles.MainWidget]}>
                <View style={[styles.TextStyles, styles.InfoBox]}>
                    <Text style={[styles.TextStyles,styles.CurrentVehicle]}>NickName</Text>
                    <Text style={[styles.TextStyles,styles.CurrentVehicle]}>Make</Text>
                    <Text style={[styles.TextStyles,styles.CurrentVehicle]}>Model</Text>
                    <Text style={[styles.TextStyles,styles.CurrentVehicle]}>Year</Text>
                    <Text style={[styles.TextStyles,styles.CurrentVehicle]}>Plate</Text>
                </View>
                <View style={styles.CircularTimer}>
                    <Text style={[styles.TextStyles, styles.TimerText]}>24:00</Text>
                </View>
            </View>
        </View>
        <View style={styles.BottomWidgets}>
            <View style={[styles.Widgets,styles.LeftWidget]}>
                <View style={styles.QuickVehicles}>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                </View>
                <View style={styles.MoreVehicles}>
                    <Ionicons style={styles.icon} name="add-circle" size={32} color="#8e8e93" />
                    <Text style={[styles.TextStyles, styles.AddVehicle]}>  Add Vehicle</Text>
                </View>
            </View>
            <View style={[styles.Widgets,styles.RightWidget]}>
                <View style={styles.History}>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                    <View style={styles.Vehicles3}>
                    <Text style={[styles.TextStyles]}>NickName</Text>
                    <Text style={[styles.TextStyles]}>Make</Text>
                    <Text style={[styles.TextStyles]}>Model</Text>
                    <Text style={[styles.TextStyles]}>Year</Text>
                    <Text style={[styles.TextStyles]}>Plate</Text>
                    </View>
                </View>
                <View style={styles.Settings}>
                    <Ionicons style={styles.icon} name="settings-outline" size={24} color="#8e8e93"/>                    
                    <Text style={[styles.TextStyles, styles.SettingsButton]}>Settings</Text>
                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#0d0d0d',
},
CurrentVehicle:{
marginLeft:20,
marginBottom:20,
fontSize:20,
},
TextStyles:{
    color:'#8e8e93',
    fontFamily: 'Poppins_400Regular',
},
Widgets: {
  backgroundColor: '#1c1c1e',
  color: '#8e8e93',
},
TopWidget:{
  flex: .75,
},
MainWidget: {
    flex:1,
  borderRadius: 20,
  overflow: 'hidden',
  padding: 20,
  borderWidth: 0.8,
  borderColor: 'rgba(255,255,255,0.25)',
  marginTop: 70,
  marginBottom: 14,
  marginLeft:15,
  marginRight:15,
  flexDirection:'row',
},
InfoBox:{
    flex:1,
  borderWidth: 0.8,
  borderColor: 'rgba(255,255,255,0.25)',
},
CircularTimer: {
  width: width * 0.35,
  height: width * 0.35,
  borderRadius: width * 0.5,
  borderWidth: 16,
  borderColor: 'rgba(0, 255, 4, 0.99)',
  marginTop: 50,
  marginLeft: 50,
  justifyContent: 'center',  
  alignItems: 'center',     
},
TimerText:{
  color: '#ffffff',
  fontFamily: 'Poppins_400Regular',
  fontSize: 20,
  textAlign: 'center',
},
BottomWidgets: {
  flex: 1,
  flexDirection: 'row',
},
icon: {
  marginTop: 35,
  marginLeft: 20,
},
Vehicles3:{
flex:1,
  borderWidth: 2,
  borderColor: 'rgba(21, 0, 255, 0.25)',
  margin:5,
},
LeftWidget: {
  flex: 1,
  borderRadius: 20,
  padding: 20,
  borderWidth: 0.8,
  borderColor: 'rgba(255,255,255,0.25)',
  marginRight: 5,
  marginLeft: 15,
  marginBottom: 30,
},
QuickVehicles:{
flex:3,
borderWidth:0.8,
borderColor:'#ff0000',
},
MoreVehicles:{
flex:1,
borderWidth:0.8,
borderColor:'#ff0000',
flexDirection:'row',
},
AddVehicle:{
fontSize:18,
marginTop:25,
flex:1,
},
RightWidget: {
  flex: 1,
  borderRadius: 20,
  padding: 20,
  borderWidth: 0.8,
  borderColor: 'rgba(255,255,255,0.25)',
  marginLeft: 5,
  marginRight: 15,
  marginBottom: 30,
},
History: {
flex:3,
borderWidth:0.8,
borderColor:'#ff0000',
},
Settings:{
flex:1,
borderWidth:0.8,
borderColor:'#ff0000',
flexDirection:'row',
},
SettingsButton:{
    fontSize:18,
    marginTop:35,
}
});