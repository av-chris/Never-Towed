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
import { useTheme } from './ThemeContext';

// Maximum number of simultaneously active permits allowed
const ACTIVE_PERMIT_LIMIT = 1;

export default function AddVehicle({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const { colors } = useTheme();

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

      // Check active permit limit before any registration attempt
      if (save !== 'Only Save') {
        const activeCount = await db.getFirstAsync(
          'SELECT COUNT(*) as count FROM permits WHERE is_active = 1'
        );
        if (activeCount.count >= ACTIVE_PERMIT_LIMIT) {
          Alert.alert(
            'Limit Reached',
            'You must wait for the current permit to expire before registering another vehicle.'
          );
          return;
        }
      }

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

  const inputIconColor = colors.accent + '99'; // ~60% opacity accent

  return (
    <LinearGradient colors={colors.gradientBg} style={styles.container}>
      <StatusBar style={colors.statusBar} />
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
              <TouchableOpacity
                style={[styles.backButton, { backgroundColor: colors.backButtonBg, borderColor: colors.backButtonBorder }]}
                onPress={() => navigation.navigate('Home')}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={styles.headerTextGroup}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Add Vehicle</Text>
                <Text style={[styles.headerSub, { color: colors.textTertiary }]}>Save or register your car</Text>
              </View>
              <View style={[styles.headerIcon, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
                <Ionicons name="car-sport" size={22} color={colors.accent} />
              </View>
            </View>

            {/* Form card */}
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderAccent, ...colors.cardShadow }]}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.cardIconBadge, { backgroundColor: colors.accentBg }]}>
                    <Ionicons name="document-text-outline" size={15} color={colors.accent} />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>Vehicle Details</Text>
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
                  <View key={key} style={[styles.inputWrapper, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                    <Ionicons name={icon} size={16} color={inputIconColor} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder={placeholder}
                      placeholderTextColor={colors.textMuted}
                      value={form[key]}
                      onChangeText={(text) => setform({ ...form, [key]: text })}
                    />
                  </View>
                ))}

                {/* State picker — opens modal with searchable list */}
                <TouchableOpacity
                  style={[styles.inputWrapper, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
                  onPress={() => setStatePickerOpen(true)}
                >
                  <Ionicons name="location-outline" size={16} color={inputIconColor} style={styles.inputIcon} />
                  <Text style={[styles.input, !selectedState && { color: colors.textMuted }]}>
                    {selectedState || 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              {/* Save/Register dropdown to select submit behavior */}
              <View style={[styles.actionDropdown, { backgroundColor: colors.surfaceSecondary, borderColor: 'rgba(196,181,253,0.2)' }]}>
                <TouchableOpacity style={styles.actionDropdownHeader} onPress={() => setSaveOpen(!saveOpen)}>
                  <View style={styles.cardTitleRow}>
                    <View style={[styles.cardIconBadge, styles.actionBadge]}>
                      <Ionicons name="options-outline" size={15} color="#c4b5fd" />
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>{save}</Text>
                  </View>
                  <Ionicons
                    name={saveOpen ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>

                {saveOpen && (
                  <View style={[styles.actionDropdownBody, { borderTopColor: colors.divider }]}>
                    {['Save and Register', 'Only Save', 'Only Register'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.radioRow}
                        onPress={() => { setSave(option); setSaveOpen(false); }}
                      >
                        <Ionicons
                          name={save === option ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={save === option ? colors.accent : colors.textTertiary}
                        />
                        <Text style={[styles.radioText, { color: colors.textSecondary }, save === option && { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Submit button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}
                onPress={handleSubmit}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.accent} />
                <Text style={[styles.submitText, { color: colors.accent }]}>Submit</Text>
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
            <TouchableOpacity
              style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.borderAccent }]}
              activeOpacity={1}
            >
              <View style={[styles.modalHandle, { backgroundColor: colors.divider }]} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select State</Text>
              <View style={[styles.searchWrapper, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={16} color={colors.textTertiary} />
                <TextInput
                  style={[styles.stateSearch, { color: colors.text }]}
                  placeholder="Search state..."
                  placeholderTextColor={colors.textMuted}
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
                    style={[styles.stateOption, { borderBottomColor: colors.divider }]}
                    onPress={() => {
                      // Update both display state and form state on selection
                      setSelectedState(item);
                      setform({ ...form, licence_state: item });
                      setStatePickerOpen(false);
                      setStateSearch('');
                    }}
                  >
                    <Text style={[styles.stateText, { color: colors.text }]}>{item}</Text>
                    {selectedState === item && (
                      <Ionicons name="checkmark" size={18} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

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
    borderWidth: 1,
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
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
  },
  fieldGroup: {
    gap: 10,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  actionDropdown: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
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
  },
  actionDropdownBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
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
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
  },
  submitText: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '55%',
    padding: 20,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  stateSearch: {
    flex: 1,
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
  },
  stateText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
});
