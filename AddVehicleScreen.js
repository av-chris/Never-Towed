import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddVehicle({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <View style={styles.MainScreen}>

      </View>








    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MainScreen:{
    flex:1,
    borderWidth:2,
    borderColor:'red',
  },
});