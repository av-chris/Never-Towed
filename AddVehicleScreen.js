import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform  } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  if (!fontsLoaded) return null;

  return (




    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

  <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  

      <View style={styles.MainScreen}>

        <View style={styles.Header}>
          <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Add Vehicle</Text>
        </View>

        <View style={styles.MainContent}>
          <TextInput
            style={styles.input}
            placeholder="NickName - Optional"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TextInput
            style={styles.input}
            placeholder="License Plate"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TouchableOpacity style={styles.input}>
            <View style={styles.StateRow}>
              <Text style={styles.StatePlaceholder}>License State</Text>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Make"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
          <TextInput
            style={styles.input}
            placeholder="Color"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>

      </View>
        </KeyboardAvoidingView>
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
    backgroundColor: '#1c1c1e',
    margin: 20,
    borderRadius: 20,
    paddingVertical: 10,
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
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  ContentTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  ContentText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    color: 'rgba(255,255,255,0.6)',
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
  StateInput: {
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
  StateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  StatePlaceholder: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});