import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import ListedItemCard from '../components/ListedItemCard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyRentedItemsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [listedItems, setListedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = route?.params?.userId;

  useEffect(() => {
    const fetchListedItems = async () => {
        const token = await AsyncStorage.getItem('token');
          
      try {

        const response = await axios.get('http://192.168.238.74:5000/api/borrow/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const item_id =response.data.item_id;
        console.log(response.data);
        setListedItems(response.data);
      } catch (error) {
        console.error('Error fetching listed items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListedItems();
  }, [userId]);

  const handleRemoveItem = async (item) => {
    const itemId = item.id; // This is the borrow record ID

try {
  const token = await AsyncStorage.getItem('token');
  console.log("Token:", token); // Debugging
  await axios.patch(
    `http://192.168.1.7:5000/api/borrow/${itemId}/return`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  setListedItems((prev) => prev.filter((item) => item.id !== itemId));
} catch (error) {
  console.error('Failed to return item:', error);
}

  };

  return (
    <View style={styles.container}>
      {/* Header with centered logo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />
        </View>

        {/* Invisible placeholder to balance layout */}
        <View style={styles.iconWrapper} />
      </View>

      <Text style={styles.heading}>Rented Items</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0984e3" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={listedItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListedItemCard item={item} onRemove={()=>handleRemoveItem(item)} status={false} />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 32,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});

export default MyRentedItemsScreen;
