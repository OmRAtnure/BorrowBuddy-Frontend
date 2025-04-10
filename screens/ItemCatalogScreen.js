import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemCard from '../components/ItemCard'; // Adjust path if needed

export default function ItemCatalogScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        const response = await fetch(`http://192.168.238.74:5000/api/items/category/${category}`);
        const data = await response.json();

        if (response.ok) {
          setItems(data);
        } else {
          setError(data.error || 'Failed to load items');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemsByCategory();
  }, [category]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>BorrowBuddy</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar (non-functional for now) */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Category Name */}
      <Text style={styles.sectionTitle}>{category.toUpperCase()}</Text>

      {/* Loader */}
      {loading ? (
  <ActivityIndicator size="large" color="#5A4FCF" style={{ marginTop: 30 }} />
) : error ? (
  <Text style={{ color: 'red', textAlign: 'center', marginTop: 30 }}>{error}</Text>
) : items.length === 0 ? (
  <View style={styles.noItemsContainer}>
    <Text style={styles.noItemsText}>No items found in this category.</Text>
  </View>
) : (
  <FlatList
    data={items}
    keyExtractor={(item) => item.id.toString()}
    numColumns={2}
    contentContainerStyle={styles.grid}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    renderItem={({ item }) => (
      <ItemCard
        title={item.name}
        price={item.price}
        imageUrl={item.images[0]}
        onPress={() => navigation.navigate('ItemDetail', { item: item })}
      />
    )}
  />
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#1B1B1B',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EDF4',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 40,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  grid: {
    gap: 16,
    paddingBottom: 100,
  },
});
