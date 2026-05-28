import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, FlatList, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function QuickRegister({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
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
const [saveOpen, setSaveOpen] = useState(false)
const [save, setSave] = useState('Register');

const filteredStates = states.filter(state =>
  state.toLowerCase().startsWith(stateSearch.toLowerCase())
);
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('');


  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={['#1a1a2e', '#0d0d0d']} style={styles.container}>
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
                placeholder="NickName - Optional"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />

              {/* License Plate */}
              <TextInput
                style={styles.input}
                placeholder="License Plate"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />

              {/* State */}
              <TouchableOpacity style={styles.input} onPress={() => setStatePickerOpen(true)}>
                <View style={styles.StateRow}>
                  <Text style={styles.StatePlaceholder}>
                    {selectedState ? selectedState : 'License State'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                </View>
              </TouchableOpacity>
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
              setSelectedState(item);
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
              {/* Make */}
              <TextInput
                style={styles.input}
                placeholder="Make"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />

              {/* Model */}
              <TextInput
                style={styles.input}
                placeholder="Model"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />

              {/* Color */}
              <TextInput
                style={styles.input}
                placeholder="Color"
                placeholderTextColor="rgba(255,255,255,0.6)"
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
            <TouchableOpacity style={ save === 'Delete' ? styles.SubmitButtonDelete : styles.SubmitButton} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Confirm</Text>
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
    backgroundColor: 'rgba(255,255,255,0.02)',
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
    fontSize: 30,
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
buttonText:{
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
},
SubmitButton:{
    color: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 14,
    borderRadius: 40,
    marginHorizontal:110,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent:'center',
},
  DropdownContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
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
DropdownContent: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderTopWidth: 0.5,
  borderTopColor: 'rgba(255,255,255,0.1)',
},
Delete:{
  backgroundColor: 'rgba(188, 0, 0, 0.2)',
  borderRadius: 40,
  borderWidth: 0.5,
  borderColor: 'rgba(209, 0, 0, 0.7)',
  marginBottom: 16,
  overflow: 'hidden',
},
SubmitButtonDelete:{
    color: 'rgba(255,255,255,0.6)',
  backgroundColor: 'rgba(188, 0, 0, 0.2)',
    paddingVertical: 14,
    borderRadius: 40,
    marginHorizontal:110,
    marginBottom: 16,
    borderWidth: 0.5,
  borderColor: 'rgba(209, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent:'center',
},
});