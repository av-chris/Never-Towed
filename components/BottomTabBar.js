import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomTabBar({ navigation, active = 'Home' }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { key: 'AddVehicle', icon: 'add', route: 'AddVehicle' },
    { key: 'Home', icon: 'home', route: 'Home' },
    { key: 'Settings', icon: 'settings-outline', route: 'Settings' },
  ];

  return (
    <BlurView intensity={40} tint="dark" style={styles.tabBar}>
      <View style={[styles.tabRow, { paddingBottom: 10 + insets.bottom }]}>
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => {
                if (tab.key !== active) navigation.navigate(tab.route);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={tab.key === 'AddVehicle' ? 26 : 24}
                color={isActive ? '#a5b4fc' : 'rgba(255,255,255,0.45)'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 32,
  },
  tabButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
  },
});
