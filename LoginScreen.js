import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleAuthLogic = async () => {
    try {
      const response = await fetch(BASE_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: Email,
          password: Password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Tabs');
      } else Alert.alert('Error', data.message);
    } catch (error) {
      console.log(error);
      Alert.alert('error', 'something went wrong');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <StatusBar style="light" />

      {/* Ambient background accents */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Brand header */}
          <View style={styles.brandSection}>
            <View style={styles.logoBadge}>
              <Ionicons name="car-sport" size={28} color="#ffffff" />
            </View>
            <Text style={styles.headerText}>Never Towed</Text>
            <Text style={styles.tagline}>Park smart. Stay protected.</Text>
          </View>

          {/* Login card */}
          <BlurView intensity={35} tint="dark" style={styles.loginBox}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>Sign in to manage your vehicles</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'email' && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={focusedField === 'email' ? '#a5b4fc' : 'rgba(255,255,255,0.45)'}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={Email}
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  onChangeText={(text) => setEmail(text)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'password' && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedField === 'password' ? '#a5b4fc' : 'rgba(255,255,255,0.45)'}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={Password}
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  secureTextEntry
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.signInButton, pressed && styles.signInButtonPressed]}
              onPress={() => navigation.navigate('Tabs')}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInGradient}
              >
                <Text style={styles.signInText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </LinearGradient>
            </Pressable>
          </BlurView>

          <Text style={styles.footerText}>Never get towed because your permit expired</Text>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  flex: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 40,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 6,
  },
  loginBox: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
  },
  inputWrapperFocused: {
    borderColor: 'rgba(99, 102, 241, 0.6)',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  signInButton: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  signInButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  signInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signInText: {
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.3)',
    marginTop: 28,
  },
});
