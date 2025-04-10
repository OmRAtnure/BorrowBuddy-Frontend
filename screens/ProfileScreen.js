import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.238.74:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData({ username: data.username, email: data.email });
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong while fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('SignIn');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>BorrowBuddy</Text> */}
    <Image source={require('../assets/logo.png')} style={styles.header} />
      
      <View style={styles.profilePic} />
      <Text style={styles.username}>{userData.username}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => navigation.navigate('Home', {  screen: 'MyRentedItems'})}
      >
        <Text style={styles.buttonText}>My Rented Items</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => navigation.navigate('Home', {  screen: 'MyListedItems'})}
      >
        <Text style={styles.buttonText}>My Listed Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.redButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    color: '#1a3c79',
    fontWeight: '600',
    marginBottom: 24,
  },
  profilePic: {
    width: 150,
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 75,
    marginBottom: 16,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  greenButton: {
    backgroundColor: '#28c76f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#ea4c4c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
