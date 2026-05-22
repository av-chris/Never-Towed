import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,Dimensions, Settings } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
const { width, height } = Dimensions.get('window');


export default function HomeScreen() {

    const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;
  return (

    
    <View style={styles.container}>


        <View style={styles.TopWidget}>
            <View style={styles.Widgets ,styles.MainWidget}>
                <View style={styles.InfoBox}></View>
                <View style={styles.CircularTimer}>
                    <Text style={styles.TimerText}>24:00</Text>
                </View>
            </View>
        </View>


        <View style={styles.BottomWidgets}>
            <View style={styles.Widgets,styles.LeftWidget}>
                <View style={styles.QuickVehicles}></View>
                <View style={styles.MoreVehicles}></View>
            </View>
            <View style={styles.Widgets,styles.RightWidget}>
                <View style={styles.History}></View>
                <View style={styles.Settings}></View>
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
  marginTop:50,
  marginLeft:50,
  marginRight:0,
},
TimerText:{
    color:'#ffffff',
    fontFamily: 'Poppins_400Regular',
    fontSize:20,
    marginTop:40,
    marginLeft:30,
},




BottomWidgets: {
  flex: 1,
  flexDirection: 'row',
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
},

});