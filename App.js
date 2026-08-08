import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import AddVehicle from './AddVehicleScreen';
import SettingsScreen from './Settings';
import HistoryDetail from './HistoryDetails';
import QuickRegister from './QuickRegister';
import VehicleDetail from './VehicleDetails';
import { SQLiteProvider } from 'expo-sqlite';
import { getSlideDirection } from './navigationDirection';

const Stack = createNativeStackNavigator();

// Tab screens use a dynamic animation set by BottomTabBar before each navigate call
const tabOptions = () => ({ headerShown: false, animation: getSlideDirection() });

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="nevertowed.db"
        onInit={async (db) => {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS vehicles(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nickname TEXT,
              licence_plate TEXT,
              licence_state TEXT,
              make TEXT,
              model TEXT,
              color TEXT
            );
            CREATE TABLE IF NOT EXISTS permits (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              licence_plate TEXT,
              licence_state TEXT,
              make TEXT,
              model TEXT,
              color TEXT,
              issue_date TEXT,
              expiration_date TEXT,
              is_active INTEGER
            );
          `);
        }}
        useSuspense={false}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0d0d' } }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* Tab screens — animation direction set dynamically by BottomTabBar */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ ...props }) => ({ ...tabOptions(), gestureEnabled: false })}
            />
            <Stack.Screen name="AddVehicle" component={AddVehicle} options={tabOptions} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={tabOptions} />
            {/* Detail screens use default push animation */}
            <Stack.Screen name="History" component={HistoryDetail} />
            <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
            <Stack.Screen name="QuickRegister" component={QuickRegister} />
          </Stack.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
