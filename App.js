import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import AddVehicle from './AddVehicleScreen';
import SettingsScreen from './Settings';
import HistoryDetail from './HistoryDetails';
import QuickRegister from './QuickRegister';
import VehicleDetail from './VehicleDetails';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false,contentStyle: { backgroundColor: '#0d0d0d' }}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddVehicle" component={AddVehicle} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="History" component={HistoryDetail} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
        <Stack.Screen name="QuickRegister" component={QuickRegister} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}