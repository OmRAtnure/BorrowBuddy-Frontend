import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens inside the Home tab
import HomeScreen from '../screens/HomeScreen';
import ItemDetailScreen from '../screens/ItemDetailsScreen';
import ItemCatalogScreen from '../screens/ItemCatalogScreen';
import MyListedItemsScreen from '../screens/MyListedItemsScreen';
import MyRentedItemsScreen from '../screens/MyRentedItemsScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="ItemCatalog" component={ItemCatalogScreen} />
      <Stack.Screen name="MyListedItems" component={MyListedItemsScreen} />
      <Stack.Screen name="MyRentedItems" component={MyRentedItemsScreen} />
    </Stack.Navigator>
  );
}
