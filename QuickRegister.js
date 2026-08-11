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

export default function QuickRegister({ navigation, route }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  // Access the SQLite database provided by SQLiteProvider in App.js
  const db = useSQLiteContext();
  // Vehicle passed from HomeScreen
  const vehicle = route.params.vehicle;

  // State picker
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
  const [stateSearch, setStateSearch] = useState('');
  const filteredStates = states.filter(state => state.toLowerCase().startsWith(stateSearch.toLowerCase()));
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(vehicle?.licence_state || '');
  // Action dropdown — Register / Edit / Delete
  const [saveOpen, setSaveOpen] = useState(false);
  const [save, setSave] = useState('Register');

  // Controlled form state for all vehicle input fields
  const [form, setform] = useState({
    nickname:      vehicle?.nickname      || '',
    licence_plate: vehicle?.licence_plate || '',
    licence_state: vehicle?.licence_state || '',
    make:          vehicle?.make          || '',
    model:         vehicle?.model         || '',
    color:         vehicle?.color         || '',
  });

  // Handles Register, Edit, and Delete based on selected mode
  const handleSubmit = async () => {
    async function Register() {
      const response = await fetch(BASE_URL + '/RegisterVehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licence_plate: vehicle.licence_plate,
          licence_state: vehicle.licence_state,
          make:          vehicle.make,
          model:         vehicle.model,
          color:         vehicle.color,
        }),
      });
      const data = await response.json();
      await db.runAsync(
        'INSERT INTO permits(licence_plate, licence_state, make, model, color, issue_date, expiration_date, is_active) VALUES (?,?,?,?,?,?,?,?)',
        [data.licence_plate, data.licence_state, data.make, data.model, data.color, data.issue_date, data.expiration_date, data.is_active ? 1 : 0]
      );
      const result = await db.getAllAsync('SELECT * FROM permits');
      console.log('permits in db:', result);
    }
    async function Delete() {
      await db.runAsync('DELETE FROM vehicles WHERE id = ?', [vehicle.id]);
    }
    async function Edit() {
      await db.runAsync(
        'UPDATE vehicles SET nickname = ?, licence_plate = ?, licence_state = ?, make = ?, model = ?, color = ? WHERE id = ?',
        [form.nickname, form.licence_plate, form.licence_state, form.make, form.model, form.color, vehicle.id]
      );
      const result = await db.getAllAsync('SELECT * FROM vehicles WHERE id= ?', (vehicle.id));
      console.log('VEHICLE IN DATABASE:', result);
    }
    try {
      if (save === 'Register') {
        await Register();
        Alert.alert('Success', 'Vehicle registered successfully!');
        navigation.goBack();
      }
      if (save === 'Delete') {
        await Delete();
        Alert.alert('Success', 'Vehicle deleted successfully!');
        navigation.goBack();
      }
      if (save === 'Edit') {
        await Edit();
        Alert.alert('Success', 'Vehicle Edited successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  if (!fontsLoaded) return null;

  const isDelete = save === 'Delete';

  // Per-field icon map
  const fields = [
    { key: 'nickname',     placeholder: 'Nickname (optional)', icon: 'pricetag-outline'      },
    { key: 'licence_plate', placeholder: 'License Plate',      icon: 'card-outline'           },
    { key: 'make',         placeholder: 'Make',                icon: 'car-outline'            },
    { key: 'model',        placeholder: 'Model',               icon: 'construct-outline'      },
    { key: 'color',        placeholder: 'Color',               icon: 'color-palette-outline'  },
  ];

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
            {/* ── Header ── */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={22} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerTextGroup}>
                <Text style={styles.headerTitle}>Quick Register</Text>
                <Text style={styles.headerSub}>
                  {vehicle?.nickname || vehicle?.licence_plate || 'Saved vehicle'}
                </Text>
              </View>
              <View style={styles.headerIcon}>
                <Ionicons name="flash" size={20} color="#a5b4fc" />
              </View>
            </View>

            {/* ── Form card ── */}
            <View style={styles.card}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBadge}>
                  <Ionicons name="car-sport" size={15} color="#a5b4fc" />
                </View>
                <Text style={styles.cardTitle}>Vehicle Details</Text>
              </View>

              {/* Text inputs */}
              <View style={styles.fieldGroup}>
                {fields.map(({ key, placeholder, icon }) => (
                  <View key={key} style={styles.inputWrapper}>
                    <Ionicons
                      name={icon}
                      size={16}
                      color="rgba(165,180,252,0.6)"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      editable={save === 'Edit'}
                      value={form[key]}
                      onChangeText={(text) => setform({ ...form, [key]: text })}
                      placeholder={placeholder}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                    />
                  </View>
                ))}

                {/* State picker row */}
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={() => save === 'Edit' && setStatePickerOpen(true)}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="rgba(165,180,252,0.6)"
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.input, !selectedState && styles.placeholderText]}>
                    {selectedState || 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* ── Action dropdown (Register / Edit / Delete) ── */}
              <View style={[
                isDelete ? styles.actionDropdownDelete : styles.actionDropdown,
                saveOpen && styles.actionDropdownOpen,
              ]}>
                <TouchableOpacity
                  style={styles.actionDropdownHeader}
                  onPress={() => setSaveOpen(!saveOpen)}
                >
                  <View style={styles.actionLeft}>
                    <View style={[styles.cardIconBadge, isDelete ? styles.deleteBadge : styles.actionBadge]}>
                      <Ionicons
                        name={isDelete ? 'trash-outline' : 'options-outline'}
                        size={15}
                        color={isDelete ? '#f87171' : '#c4b5fd'}
                      />
                    </View>
                    <Text style={[styles.actionLabel, isDelete && styles.actionLabelDelete]}>
                      {save}
                    </Text>
                  </View>
                  <Ionicons
                    name={saveOpen ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color="rgba(255,255,255,0.4)"
                  />
                </TouchableOpacity>

                {saveOpen && (
                  <View style={styles.actionDropdownBody}>
                    {['Register', 'Edit', 'Delete'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.radioRow}
                        onPress={() => { setSave(option); setSaveOpen(false); }}
                      >
                        <Ionicons
                          name={save === option ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={option === 'Delete' ? '#f87171' : '#a5b4fc'}
                        />
                        <Text style={[
                          styles.radioText,
                          save === option && styles.radioTextActive,
                          option === 'Delete' && styles.radioTextDelete,
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* ── Confirm button ── */}
              <TouchableOpacity
                style={isDelete ? styles.confirmButtonDelete : styles.confirmButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isDelete ? 'trash-outline' : 'checkmark-circle-outline'}
                  size={18}
                  color="#ffffff"
                />
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── State picker modal ── */}
        <Modal visible={statePickerOpen} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => { setStatePickerOpen(false); setStateSearch(''); }}
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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  /* ── Scroll ── */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  /* ── Header ── */
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

  /* ── Main card ── */
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
    gap: 10,
    marginBottom: 16,
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

  /* ── Input fields ── */
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

  /* ── Action dropdown ── */
  actionDropdown: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.2)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  actionDropdownDelete: {
    backgroundColor: 'rgba(248,113,113,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
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
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBadge: {
    backgroundColor: 'rgba(196,181,253,0.15)',
  },
  deleteBadge: {
    backgroundColor: 'rgba(248,113,113,0.15)',
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_700Bold',
    color: '#ffffff',
  },
  actionLabelDelete: {
    color: '#f87171',
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
  radioTextDelete: {
    color: '#f87171',
  },

  /* ── Confirm button ── */
  confirmButton: {
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
  confirmButtonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(248,113,113,0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.4)',
    paddingVertical: 14,
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },

  /* ── State picker modal ── */
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
