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
import { useTheme } from './ThemeContext';

export default function LoginScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const { colors } = useTheme();
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
    <LinearGradient colors={colors.gradientBg} style={styles.container}>
      <StatusBar style={colors.statusBar} />

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
            <View style={[styles.logoBadge, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
              <Ionicons name="car-sport" size={28} color={colors.accent} />
            </View>
            <Text style={[styles.headerText, { color: colors.text }]}>Never Towed</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>Park smart. Stay protected.</Text>
          </View>

          {/* Login card */}
          <BlurView intensity={35} tint={colors.blurTint} style={[styles.loginBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Welcome back</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>Sign in to manage your vehicles</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Username</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  focusedField === 'email' && { borderColor: colors.accentBorder, backgroundColor: colors.accentBgSoft },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={focusedField === 'email' ? colors.accent : colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={Email}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(text) => setEmail(text)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                  focusedField === 'password' && { borderColor: colors.accentBorder, backgroundColor: colors.accentBgSoft },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={focusedField === 'password' ? colors.accent : colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={Password}
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
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

          <Text style={[styles.footerText, { color: colors.textMuted }]}>Never get towed because your permit expired</Text>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 34,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
  },
  loginBox: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 28,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
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
    marginTop: 28,
  },
});
