import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground,ScrollView, Platform,KeyboardAvoidingView  } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({navigation}) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      

      <StatusBar style="light" />
      <View style={styles.overlay}>
        <Text style={styles.headerText}>Never Towed</Text>
        <BlurView intensity={20} tint="dark" style={styles.loginBox}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry
          />
            <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Home')}>
             <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.linkText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000000'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 42,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    position: 'absolute',
    top: 90,
    left: 20,
  },
  loginBox: {
    width: 320,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.25)',
    marginTop: 80,
  },
  input: {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 40,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  signInButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 16,
  },
  signInText: {
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
  },
});