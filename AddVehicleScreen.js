import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { BASE_URL } from './config';
import BottomTabBar from './components/BottomTabBar';

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licence_plate: form.licence_plate,
          licence_state: form.licence_state,
          make: form.make,
          model: form.model,
          color: form.color,
        }),
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
        navigation.navigate('Home');
      } else if (save === 'Only Register') {
        await Register();
        Alert.alert('Success', 'Vehicle registered successfully!');
        navigation.navigate('Home');
      } else {
        // Default: Save and Register — hit the API and save to both tables
        await Register();
        await Save();
        Alert.alert('Success', 'Vehicle saved & registered successfully!');
        navigation.navigate('Home');
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
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerTextGroup}>
                <Text style={styles.headerTitle}>Add Vehicle</Text>
                <Text style={styles.headerSub}>Save or register your car</Text>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name="car-sport" size={22} color="#a5b4fc" />
              </View>
            </View>

            {/* Form card */}
            <View style={styles.card}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={styles.cardIconBadge}>
                    <Ionicons name="document-text-outline" size={15} color="#a5b4fc" />
                  </View>
                  <Text style={styles.cardTitle}>Vehicle Details</Text>
                </View>
              </View>

              {/* Input fields */}
              <View style={styles.fieldGroup}>
                {[
                  { key: 'nickname', placeholder: 'Nickname (optional)', icon: 'pricetag-outline' },
                  { key: 'licence_plate', placeholder: 'License Plate', icon: 'card-outline' },
                  { key: 'make', placeholder: 'Make', icon: 'car-outline' },
                  { key: 'model', placeholder: 'Model', icon: 'construct-outline' },
                  { key: 'color', placeholder: 'Color', icon: 'color-palette-outline' },
                ].map(({ key, placeholder, icon }) => (
                  <View key={key} style={styles.inputWrapper}>
                    <Ionicons name={icon} size={16} color="rgba(165,180,252,0.6)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={placeholder}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={form[key]}
                      onChangeText={(text) => setform({ ...form, [key]: text })}
                    />
                  </View>
                ))}

                {/* State picker — opens modal with searchable list */}
                <TouchableOpacity style={styles.inputWrapper} onPress={() => setStatePickerOpen(true)}>
                  <Ionicons name="location-outline" size={16} color="rgba(165,180,252,0.6)" style={styles.inputIcon} />
                  <Text style={[styles.input, !selectedState && styles.placeholderText]}>
                    {selectedState || 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Save/Register dropdown to select submit behavior */}
              <View style={[styles.actionDropdown, saveOpen && styles.actionDropdownOpen]}>
                <TouchableOpacity style={styles.actionDropdownHeader} onPress={() => setSaveOpen(!saveOpen)}>
                  <View style={styles.cardTitleRow}>
                    <View style={[styles.cardIconBadge, styles.actionBadge]}>
                      <Ionicons name="options-outline" size={15} color="#c4b5fd" />
                    </View>
                    <Text style={styles.actionLabel}>{save}</Text>
                  </View>
                  <Ionicons
                    name={saveOpen ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="rgba(255,255,255,0.4)"
                  />
                </TouchableOpacity>

                {saveOpen && (
                  <View style={styles.actionDropdownBody}>
                    {['Save and Register', 'Only Save', 'Only Register'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.radioRow}
                        onPress={() => { setSave(option); setSaveOpen(false); }}
                      >
                        <Ionicons
                          name={save === option ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={save === option ? '#a5b4fc' : 'rgba(255,255,255,0.3)'}
                        />
                        <Text style={[styles.radioText, save === option && styles.radioTextActive]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Submit button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

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
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select State</Text>
              <View style={styles.searchWrapper}>
                <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.4)" />
                <TextInput
                  style={styles.stateSearch}
                  placeholder="Search state..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={stateSearch}
                  onChangeText={setStateSearch}
                />
              </View>
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
                    {selectedState === item && (
                      <Ionicons name="checkmark" size={18} color="#a5b4fc" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <BottomTabBar navigation={navigation} active="AddVehicle" />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.45)',
    marginTop: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99,102,241,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },
  fieldGroup: {
    gap: 10,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.3)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 14,
  },
  actionDropdown: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.2)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  actionDropdownOpen: {
    borderRadius: 14,
  },
  actionDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  actionBadge: {
    backgroundColor: 'rgba(196,181,253,0.15)',
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },
  actionDropdownBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 4,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  radioText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  radioTextActive: {
    color: '#a5b4fc',
    fontFamily: 'Poppins_700Bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(99,102,241,0.25)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.5)',
    paddingVertical: 14,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#16162a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '55%',
    padding: 20,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(99,102,241,0.25)',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.15)',
  },
  stateSearch: {
    flex: 1,
    color: '#ffffff',
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  stateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  stateText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});
