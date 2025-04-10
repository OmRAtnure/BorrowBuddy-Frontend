import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Toast,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const screenWidth = Dimensions.get('window').width;

const ItemDetailScreen = ({ route }) => {
  const { item } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const handleRentItem = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Authentication required',
      });
      return;
    }

    const response = await axios.post(
      'http://192.168.238.74:5000/api/borrow',
      { item_id: item.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Toast.show({
      type: 'success',
      text1: 'Item Rented Successfully!',
    });

    // Navigate back or update state
    navigation.goBack();

  } catch (error) {
    console.error('Renting error:', error.response?.data || error.message);
    Toast.show({
      type: 'error',
      text1: error.response?.data?.error || 'Failed to rent item.',
    });
  }
};


  const renderImage = ({ item: image }) => (
    <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top header with back and logo */}
        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                {/* <Text style={styles.title}>BorrowBuddy</Text> */}
                <Image source={require('../assets/logo.png')} style={styles.title} />
                
                <View style={{ width: 24 }} />
              </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={item.images}
              renderItem={renderImage}
              keyExtractor={(img, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
            />
            <View style={styles.dotsContainer}>
              {item.images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, currentIndex === index && styles.activeDot]}
                />
              ))}
            </View>
          </View>

          {/* Item details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>
              Listed on: {new Date(item.created_at).toDateString()}
            </Text>
          </View>
        </ScrollView>

        {/* Rent button */}
        <View style={styles.rentButtonContainer}>
          <TouchableOpacity
              style={[styles.rentButton, !item.available && { backgroundColor: '#ccc' }]}
              onPress={handleRentItem}
              disabled={!item.available}
            >
              <Text style={styles.rentButtonText}>
                {item.available ? 'Rent' : 'Already Rented'}
              </Text>
            </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  carouselContainer: {
    marginTop: 0,
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 250,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3498db',
    width: 10,
    height: 10,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  rentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  rentButton: {
    backgroundColor: '#28c76f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  rentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;
