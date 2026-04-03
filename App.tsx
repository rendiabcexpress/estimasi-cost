import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { CalculatorScreen } from './src/screens/CalculatorScreen';
import { InfoScreen } from './src/screens/InfoScreen';
import { colors, radius } from './src/components/ui/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: radius.sm,
        backgroundColor: focused ? colors.primaryLight : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.white} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.white,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              height: 64,
              paddingBottom: 8,
              paddingTop: 4,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
          }}
        >
          <Tab.Screen
            name="Kalkulator"
            component={CalculatorScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
            }}
          />
          <Tab.Screen
            name="Info"
            component={InfoScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon emoji="ℹ️" focused={focused} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
