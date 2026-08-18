import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import {
  NavigationContainer,
  useNavigationBuilder,
  createNavigatorFactory,
  TabRouter,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { SQLiteProvider } from 'expo-sqlite';

import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import AddVehicle from './AddVehicleScreen';
import SettingsScreen from './Settings';
import HistoryDetail from './HistoryDetails';
import QuickRegister from './QuickRegister';
import VehicleDetail from './VehicleDetails';

// ─────────────────────────────────────────────────────────────
// Persistent tab bar — rendered once, never unmounts
// ─────────────────────────────────────────────────────────────
const TAB_CONFIG = [
  { name: 'AddVehicle', icon: 'add' },
  { name: 'Home',       icon: 'home' },
  { name: 'Settings',   icon: 'settings-outline' },
];

function TrifoldTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const activeRoute = state.routes[state.index].name;

  return (
    <BlurView
      intensity={40}
      tint={colors.blurTint}
      style={[tabStyles.bar, { borderTopColor: colors.tabBarBorder }]}
    >
      <View style={[tabStyles.row, { paddingBottom: 10 + insets.bottom }]}>
        {TAB_CONFIG.map((tab) => {
          const isActive = activeRoute === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                tabStyles.button,
                isActive && {
                  backgroundColor: colors.tabActiveBg,
                  borderWidth: 1,
                  borderColor: colors.tabActiveBorder,
                  borderRadius: 16,
                },
              ]}
              onPress={() => navigation.navigate(tab.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={tab.name === 'AddVehicle' ? 26 : 24}
                color={isActive ? colors.tabActiveIcon : colors.tabInactiveIcon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 32,
    marginBottom: 1,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─────────────────────────────────────────────────────────────
// Trifold scene container
//   • Home   — z-index 1, never moves, always the base layer
//   • AddVehicle — z-index 2, slides in from the LEFT over Home
//   • Settings   — z-index 2, slides in from the RIGHT over Home
// ─────────────────────────────────────────────────────────────
const SPRING = { useNativeDriver: true, tension: 120, friction: 22 };

function TrifoldView({ state, navigation, descriptors }) {
  const { width } = useWindowDimensions();

  const addX = useRef(new Animated.Value(-width)).current;
  const setX = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const active = state.routes[state.index].name;

    if (active === 'Home') {
      // Both panels slide back off-screen
      Animated.parallel([
        Animated.spring(addX, { toValue: -width, ...SPRING }),
        Animated.spring(setX, { toValue:  width, ...SPRING }),
      ]).start();
    } else if (active === 'AddVehicle') {
      // Snap Settings off instantly, slide AddVehicle in from left
      setX.setValue(width);
      Animated.spring(addX, { toValue: 0, ...SPRING }).start();
    } else if (active === 'Settings') {
      // Snap AddVehicle off instantly, slide Settings in from right
      addX.setValue(-width);
      Animated.spring(setX, { toValue: 0, ...SPRING }).start();
    }
  }, [state.index, width]);

  return (
    <View style={{ flex: 1 }}>
      {/* ── Screen layer ── */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {state.routes.map((route, i) => {
          const { name } = route;
          const isFocused = state.index === i;

          // Determine animated style per tab
          let animatedStyle;
          if (name === 'Home') {
            animatedStyle = { zIndex: 1 };                              // never moves
          } else if (name === 'AddVehicle') {
            animatedStyle = { zIndex: 2, transform: [{ translateX: addX }] };
          } else {
            animatedStyle = { zIndex: 2, transform: [{ translateX: setX }] };
          }

          return (
            <Animated.View
              key={route.key}
              style={[StyleSheet.absoluteFill, animatedStyle]}
              // Only the focused screen should receive touches
              pointerEvents={isFocused ? 'auto' : 'none'}
            >
              {descriptors[route.key].render()}
            </Animated.View>
          );
        })}
      </View>

      {/* ── Persistent tab bar ── */}
      <TrifoldTabBar state={state} navigation={navigation} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom navigator — wires React Navigation lifecycle to TrifoldView
// Uses TabRouter so useFocusEffect / useIsFocused work in every screen
// ─────────────────────────────────────────────────────────────
function TrifoldNavigator({ children, screenOptions, initialRouteName }) {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(
    TabRouter,
    { children, screenOptions, initialRouteName }
  );

  return (
    <NavigationContent>
      <TrifoldView state={state} navigation={navigation} descriptors={descriptors} />
    </NavigationContent>
  );
}

const createTrifoldNavigator = createNavigatorFactory(TrifoldNavigator);
const Trifold = createTrifoldNavigator();

// ─────────────────────────────────────────────────────────────
// Tab screens (nested inside the outer stack)
// ─────────────────────────────────────────────────────────────
function TabScreens() {
  return (
    <Trifold.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Trifold.Screen name="AddVehicle" component={AddVehicle} />
      <Trifold.Screen name="Home"       component={HomeScreen} />
      <Trifold.Screen name="Settings"   component={SettingsScreen} />
    </Trifold.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────
// Outer stack — Login + tab shell + detail screens
// Wrapped in its own component so it can call useTheme() for
// the contentStyle background, which must come from inside ThemeProvider.
// ─────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();

function ThemedStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gradientBg[1] },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Tab shell — gestureEnabled:false so you can't swipe back to Login */}
      <Stack.Screen
        name="Tabs"
        component={TabScreens}
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      {/* Detail screens pushed on top of the tab shell */}
      <Stack.Screen name="History"       component={HistoryDetail} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
      <Stack.Screen name="QuickRegister" component={QuickRegister} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
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
          <ThemedStack />
        </NavigationContainer>
      </SQLiteProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
