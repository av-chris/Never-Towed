import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { BASE_URL } from './config';

export default function AddVehicle({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  // Full list of US states for the state picker modal
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ];

  // Controls the state search input and modal visibility
  const [stateSearch, setStateSearch] = useState('');
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  // Controls the save/register dropdown and which option is selected
  const [saveOpen, setSaveOpen] = useState(false);
  const [save, setSave] = useState('Save and Register');

  // Filters state list as the user types in the search input
  const filteredStates = states.filter(state =>
    state.toLowerCase().startsWith(stateSearch.toLowerCase())
  );

  // Access the SQLite database provided by SQLiteProvider in App.js
  const db = useSQLiteContext();

  // Controlled form state for all vehicle input fields
  const [form, setform] = useState({
    nickname: '',
    licence_plate: '',
    licence_state: '',
    make: '',
    model: '',
    color: '',
  });

  const handleSubmit = async () => {

    // Sends vehicle data to the Express backend to create a permit,
    // then saves the returned permit (with issue/expiration dates) to local SQLite
     async function Register() {
      const response = await fetch(BASE_URL + '/RegisterVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licence_plate: form.licence_plate,
          licence_state: form.licence_state,
          make: form.make,
          model: form.model,
          color: form.color
        })
      });

      // Parse the permit object returned by the server
      const data = await response.json();

      // Insert the permit into local history — is_active stored as 1 (true) or 0 (false)
      await db.runAsync(
        'INSERT INTO permits(licence_plate, licence_state, make, model, color, issue_date, expiration_date, is_active) VALUES (?,?,?,?,?,?,?,?)',
        [data.licence_plate, data.licence_state, data.make, data.model, data.color, data.issue_date, data.expiration_date, data.is_active ? 1 : 0]
      );

      const result = await db.getAllAsync('SELECT * FROM permits');
      console.log('permits in db:', result);
    }

    // Saves vehicle profile to local SQLite vehicles table for future quick registration
    async function Save() {
      await db.runAsync(
        'INSERT INTO vehicles(nickname, licence_plate, licence_state, make, model, color) VALUES (?,?,?,?,?,?)',
        [form.nickname || form.licence_plate, form.licence_plate, form.licence_state, form.make, form.model, form.color]
      );

      const result = await db.getAllAsync('SELECT * FROM vehicles');
      console.log('vehicles in db', result);
    }

    try {
      // Validate that all required fields are filled before proceeding
      if (!form.licence_plate || !form.licence_state || !form.make || !form.model || !form.color)
        throw new Error('All fields are required');

      // Execute the appropriate action based on the user's selected option
      if (save === 'Only Save') {
        await Save();
        Alert.alert('Success', 'Vehicle saved successfully!');
        navigation.navigate('Home')
      } else if (save === 'Only Register') {
        await Register();
        Alert.alert('Success', 'Vehicle registered successfully!');
        navigation.navigate('Home')
      } else {
        // Default: Save and Register — hit the API and save to both tables
        await Register();
        await Save();
        Alert.alert('Success', 'Vehicle saved & registered successfully!');
        navigation.navigate('Home')
      }

      // Reset form fields after successful submission
      setform({
        nickname: '',
        licence_plate: '',
        licence_state: '',
        make: '',
        model: '',
        color: '',
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the vehicle');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.MainScreen}>

            {/* Header with back button */}
            <View style={styles.Header}>
              <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.HeaderText}>Add Vehicle</Text>
            </View>

            <View style={styles.MainContent}>

              {/* Nickname — optional label for quick identification */}
              <TextInput
                style={styles.input}
                placeholder="NickName - Optional"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.nickname}
                onChangeText={(text) => setform({ ...form, nickname: text })}
              />

              {/* License plate input */}
              <TextInput
                style={styles.input}
                placeholder="License Plate"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.licence_plate}
                onChangeText={(text) => setform({ ...form, licence_plate: text })}
              />

              {/* State picker — opens modal with searchable list */}
              <TouchableOpacity style={styles.input} onPress={() => setStatePickerOpen(true)}>
                <View style={styles.StateRow}>
                  <Text style={styles.StatePlaceholder}>
                    {selectedState ? selectedState : 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                </View>
              </TouchableOpacity>

              {/* State picker modal with live search filter */}
              <Modal visible={statePickerOpen} transparent animationType="slide">
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => {
                    setStatePickerOpen(false);
                    setStateSearch('');
                  }}
                >
                  <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
                    <TextInput
                      style={styles.stateSearch}
                      placeholder="Search state..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={stateSearch}
                      onChangeText={setStateSearch}
                    />
                    <FlatList
                      data={filteredStates}
                      keyExtractor={(item) => item}
                      keyboardShouldPersistTaps="handled"
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.stateOption}
                          onPress={() => {
                            // Update both display state and form state on selection
                            setSelectedState(item);
                            setform({ ...form, licence_state: item });
                            setStatePickerOpen(false);
                            setStateSearch('');
                          }}
                        >
                          <Text style={styles.stateText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>

              {/* Vehicle make, model, and color inputs */}
              <TextInput
                style={styles.input}
                placeholder="Make"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.make}
                onChangeText={(text) => setform({ ...form, make: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Model"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.model}
                onChangeText={(text) => setform({ ...form, model: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Color"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={form.color}
                onChangeText={(text) => setform({ ...form, color: text })}
              />

              {/* Dropdown to select submit behavior: Save and Register, Only Save, or Only Register */}
              <View style={[styles.SubmitButtonWrapper, saveOpen && styles.SubmitButtonWrapperOpen]}>
                <TouchableOpacity style={styles.SubmitButtonInner} onPress={() => setSaveOpen(!saveOpen)}>
                  <Text style={styles.buttonText}>{save}</Text>
                  <Ionicons name={saveOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>

                {saveOpen && (
                  <View style={styles.DropdownContent}>
                    {['Save and Register', 'Only Save', 'Only Register'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.CheckboxRow}
                        onPress={() => { setSave(option); setSaveOpen(false); }}
                      >
                        <Ionicons
                          name={save === option ? 'radio-button-on' : 'radio-button-off'}
                          size={22}
                          color="rgba(255,255,255,0.6)"
                        />
                        <Text style={styles.DropdownText}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Submit button — triggers handleSubmit with the selected save option */}
              <TouchableOpacity style={styles.SubmitButton} onPress={() => { handleSubmit(); }}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
  input: {
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '55%',
    padding: 20,
    paddingBottom: 35,
  },
  stateSearch: {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  stateOption: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  stateText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  buttonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  SubmitButton: {
    color: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 14,
    borderRadius: 40,
    marginHorizontal: 110,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DropdownContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  CheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  DropdownText: {
    color: '#8e8e93',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    paddingVertical: 4,
  },
  SubmitButtonWrapper: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  SubmitButtonWrapperOpen: {
    borderRadius: 20,
  },
  SubmitButtonInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});