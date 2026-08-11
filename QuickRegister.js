import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { BASE_URL } from './config';
import { useTheme } from './ThemeContext';


export default function QuickRegister({ navigation, route }) {
  const { colors } = useTheme();
    const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  // Access the SQLite database provided by SQLiteProvider in App.js
  const db = useSQLiteContext();
  // Vehicle passed from HomeScreen
  const vehicle = route.params.vehicle

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
const filteredStates = states.filter(state =>state.toLowerCase().startsWith(stateSearch.toLowerCase()));
const [statePickerOpen, setStatePickerOpen] = useState(false);
const [selectedState, setSelectedState] = useState(vehicle?.licence_state || '');
// Action dropdown — Register / Edit / Delete
const [saveOpen, setSaveOpen] = useState(false)
const [save, setSave] = useState('Register');

  // Controlled form state for all vehicle input fields
  const [form, setform] = useState({
    nickname:vehicle?.nickname || '',
    licence_plate:vehicle?.licence_plate || '',
    licence_state:vehicle?.licence_state || '',
    make:vehicle?.make || '',
    model:vehicle?.model || '',
    color: vehicle?.color || '',
  });

// Handles Register, Edit, and Delete based on selected mode
const handleSubmit = async() => {

async function Register(){
const response = await fetch(BASE_URL + '/RegisterVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          licence_plate: vehicle.licence_plate,
          licence_state: vehicle.licence_state,
          make: vehicle.make,
          model: vehicle.model,
          color: vehicle.color
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
};
async function Delete(){
await db.runAsync('DELETE FROM vehicles WHERE id = ?', [vehicle.id])
};
async function Edit(){
await db.runAsync('UPDATE vehicles SET nickname = ?, licence_plate = ?, licence_state = ?, make = ?, model = ?, color = ? WHERE id = ?',[form.nickname,form.licence_plate,form.licence_state,form.make,form.model,form.color,vehicle.id])
  const result = await db.getAllAsync('SELECT * FROM vehicles WHERE id= ?',(vehicle.id));
  console.log('VEHICLE IN DATABASE:',result)
}
try{
if(save === 'Register'){ 
  await Register();
  Alert.alert('Success', 'Vehicle registered successfully!');
  navigation.goBack()
};
if(save === 'Delete'){
  await Delete()
  Alert.alert('Success', 'Vehicle deleted successfully!')
  navigation.goBack()

};
if(save === 'Edit'){
  await Edit()

  Alert.alert('Success', 'Vehicle Edited successfully!')
}
}
catch(error){
  console.error(error);
  Alert.alert('Error', 'An error occurred');
};
}

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.MainScreen}>
        <View style={styles.Header}>
          <TouchableOpacity style={styles.BackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Quick Register</Text>
        </View>

            <View style={styles.MainContent}>

              {/* Nick Name */}
              <TextInput
                style={styles.input}
                editable ={save ==='Edit'}
                value={form.nickname}
                onChangeText = {(text) => setform({...form, nickname: text})}
                placeholder="NickName - Optional"
                placeholderTextColor={colors.textPlaceholder}
              />

              {/* License Plate */}
              <TextInput
                style={styles.input}
                editable ={save ==='Edit'}
                value={form.licence_plate}
                onChangeText = {(text) => setform({...form, licence_plate: text})}
                placeholder="License Plate"
                placeholderTextColor={colors.textPlaceholder}
              />

              {/* State */}
              <TouchableOpacity style={styles.input} onPress={() => save ==='Edit' && setStatePickerOpen(true)}>
                <View style={styles.StateRow}>
                  <Text style={selectedState ? styles.StateSelected : styles.StatePlaceholder}>
                      {selectedState ? selectedState : 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.chevron} />
                </View>
              </TouchableOpacity>
<Modal visible={statePickerOpen} transparent animationType="slide">
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => {
    setStatePickerOpen(false)
    setStateSearch('')
    }}
  >
    <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
      <TextInput
        style={styles.stateSearch}
        placeholder="Search state..."
        placeholderTextColor={colors.textPlaceholder}
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
     setSelectedState(item)
    setform({...form, licence_state: item})
    setStatePickerOpen(false)
    setStateSearch('')
            }}
          >
            <Text style={styles.stateText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
              {/* Make */}
              <TextInput
                style={styles.input}
                editable ={save ==='Edit'}
                value={form.make}
                onChangeText = {(text) => setform({...form, make: text})}
                placeholder="Make"
                placeholderTextColor={colors.textPlaceholder}
              />

              {/* Model */}
              <TextInput
                style={styles.input}
                editable ={save ==='Edit'}
                value={form.model}
                onChangeText = {(text) => setform({...form, model: text})}
                placeholder="Model"
                placeholderTextColor={colors.textPlaceholder}
              />

              {/* Color */}
              <TextInput
                style={styles.input}
                editable ={save ==='Edit'}
                value={form.color}
                onChangeText = {(text) => setform({...form, color: text})}
                placeholder="Color"
                placeholderTextColor={colors.textPlaceholder}
              />

            {/* Save Vehicle */}
<View style={[save === 'Delete' ? styles.Delete : styles.SubmitButtonWrapper , saveOpen && styles.SubmitButtonWrapperOpen]}>
  <TouchableOpacity style={styles.SubmitButtonInner} onPress={() => setSaveOpen(!saveOpen)}>
<Text style={styles.buttonText}>{save}</Text>
    <Ionicons name={saveOpen ? 'chevron-down' : 'chevron-forward'} size={20} color="rgba(255,255,255,0.6)" />
  </TouchableOpacity>

  {saveOpen && (
    <View style={styles.DropdownContent}>
      {['Register' , 'Edit', 'Delete'].map((option) => (
        <TouchableOpacity key={option} style={styles.CheckboxRow} onPress={() => {setSave(option);setSaveOpen(false);}}>
          <Ionicons name={save === option ? 'radio-button-on' : 'radio-button-off'} size={22} color="rgba(255,255,255,0.6)" />
          <Text style={styles.DropdownText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>


            {/* Submit */}
            <TouchableOpacity style={ save === 'Delete' ? styles.SubmitButtonDelete : styles.SubmitButton} onPress={() => handleSubmit() }>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


        


function createStyles(c) {
  return StyleSheet.create({
  container: { flex: 1 },
  MainScreen: {
    marginTop: 60, borderWidth: 2,
    borderColor: c.borderWeak, backgroundColor: c.surfaceSub,
    margin: 20, borderRadius: 20, paddingVertical: 10,
  },
  Header: {
    justifyContent: 'center', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 0.3, borderBottomColor: c.borderSubtle, position: 'relative',
  },
  BackButton: { position: 'absolute', left: 15, zIndex: 1 },
  HeaderText: { color: c.text, fontSize: 30, fontFamily: 'Poppins_400Regular' },
  MainContent: { paddingTop: 10, paddingHorizontal: 10 },
  input: {
    color: c.text, backgroundColor: c.surfaceInput,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 40, marginBottom: 16, fontSize: 15,
    fontFamily: 'Poppins_400Regular', borderWidth: 0.5, borderColor: c.borderInput,
  },
  StateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  StatePlaceholder: { color: c.textPlaceholder, fontSize: 15, fontFamily: 'Poppins_400Regular' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: c.modalBg, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    height: '55%', padding: 20, paddingBottom: 35,
  },
  stateSearch: {
    color: c.text, backgroundColor: c.modalSearchBg,
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 10, marginBottom: 10, fontSize: 15, fontFamily: 'Poppins_400Regular',
  },
  stateOption: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: c.stateOptionBorder },
  stateText: { color: c.text, fontSize: 16, fontFamily: 'Poppins_400Regular' },
  buttonText: { color: c.textSecondary, fontSize: 16, fontFamily: 'Poppins_700Bold' },
  SubmitButton: {
    backgroundColor: c.surfaceInput, paddingVertical: 14, borderRadius: 40,
    marginHorizontal: 110, marginBottom: 16, borderWidth: 0.5,
    borderColor: c.borderInput, alignItems: 'center', justifyContent: 'center',
  },
  CheckboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  DropdownText: { color: c.textSecondary, fontSize: 14, fontFamily: 'Poppins_400Regular', paddingVertical: 4 },
  SubmitButtonWrapper: {
    backgroundColor: c.surfaceInput, borderRadius: 40, borderWidth: 0.5,
    borderColor: c.borderInput, marginBottom: 16, overflow: 'hidden',
  },
  SubmitButtonWrapperOpen: { borderRadius: 20 },
  SubmitButtonInner: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
  },
  DropdownContent: { paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: c.borderSubtle },
  Delete: {
    backgroundColor: 'rgba(188,0,0,0.2)', borderRadius: 40, borderWidth: 0.5,
    borderColor: 'rgba(209,0,0,0.7)', marginBottom: 16, overflow: 'hidden',
  },
  SubmitButtonDelete: {
    backgroundColor: 'rgba(188,0,0,0.2)', paddingVertical: 14, borderRadius: 40,
    marginHorizontal: 110, marginBottom: 16, borderWidth: 0.5,
    borderColor: 'rgba(209,0,0,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  StateSelected: { color: c.text, fontSize: 15, fontFamily: 'Poppins_400Regular' },
  });
}