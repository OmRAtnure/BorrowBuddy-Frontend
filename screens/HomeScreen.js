import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemCard from '../components/ItemCard';

const categories = [
  { id: '1', title: 'Tools', src: require('../assets/tool.png') },
  { id: '2', title: 'Furniture', src: require('../assets/furniture.jpeg') },
  { id: '3', title: 'Household', src: require('../assets/household.jpeg') },
  { id: '4', title: 'Electronics', src: require('../assets/electronics.png') },
  { id: '5', title: 'Miscellaneous', src: require('../assets/miscelenious.jpeg') },
  { id: '6', title: 'Toys', src: require('../assets/toys.jpeg') },
];


export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch('http://192.168.238.74:5000/api/items/items', {
        headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setItems(data);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch items.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Something went wrong.');
      }
    };

    fetchItems();
  }, []);

  const renderHeader = () => (
    <View style={{ paddingBottom: 12 }}>
      <Image source={require('../assets/logo.png')} style={styles.header} />

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="#555" />
      </View>

      <Text style={styles.sectionTitle}>CATEGORIES</Text>
      <View style={styles.categoriesContainer}>
  {categories.map((cat) => (
    <TouchableOpacity
      key={cat.id}
      style={styles.category}
      onPress={() => navigation.navigate('ItemCatalog', { category: cat.title })}
    >
      <Image source={cat.src} style={styles.categoryCircle} />
      <Text style={styles.categoryTitle}>{cat.title}</Text>
    </TouchableOpacity>
  ))}
</View>

      <Text style={styles.sectionTitle}>AVAILABLE NEAR YOU:</Text>
    </View>
  );

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FlatList
      data={filteredItems}
      key={'2-columns'}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
      renderItem={({ item }) => (
        <ItemCard
          title={item.name}
          price={item.price}
          imageUrl={item.images?.[0] || 'https://via.placeholder.com/150'}
          onPress={() => navigation.navigate('ItemDetail', { item: item })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3c79',
    marginBottom: 12,
    marginTop: 50,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#dde6ec',
    borderRadius: 25,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  category: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
});
