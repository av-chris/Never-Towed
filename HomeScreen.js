import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { BlurView } from 'expo-blur';
import { BottomTabs } from 'react-native-screens';


export default function HomeScreen() {

    const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;
  return (

    

    <ImageBackground
      source={require('./assets/eddie-pipocas-25Js9HESu4U-unsplash.jpg')}
      style={styles.container}
      resizeMode="cover">
    <BlurView intensity={30} tint="dark" style={styles.background}></BlurView>
    <View style={styles.BottomTabs}></View>






    </ImageBackground>





  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background:{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  BottomTabs:{


  },

});