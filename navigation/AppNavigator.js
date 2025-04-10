import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddNewItemScreen from '../screens/AddNewItemScreen';
import ItemCatalogScreen from '../screens/ItemCatalogScreen';
import MyListedItemsScreen from '../screens/MyListedItemsScreen';

// Stack Navigator for Home
import HomeStackNavigator from './HomeStackNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0.3,
        },
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Add') {
            iconName = 'add';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          const iconWrapperStyle =
            focused && route.name !== 'Add'
              ? {
                  backgroundColor: '#EEE9FF',
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {};

          return (
            <View style={{ alignItems: 'center', top: 10 }}>
              <View style={iconWrapperStyle}>
                <Ionicons
                  name={iconName}
                  size={20}
                  color={focused ? '#5A4FCF' : '#666'}
                />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: focused ? '#5A4FCF' : '#666',
                  marginTop: 3,
                }}
              >
                {route.name}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Add" component={AddNewItemScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
      {/* Auth Screens */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Main App */}
      <Stack.Screen name="MainTabs" component={MainTabs} />


    </Stack.Navigator>
  );
}
