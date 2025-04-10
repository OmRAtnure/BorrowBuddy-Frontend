import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ['Household', 'Electronics', 'Tools', 'Toys', 'Furniture', 'Miscellaneous'];

// Cloudinary config
const CLOUD_NAME = 'dqgztxeot';
const UPLOAD_PRESET = 'borrowbuddy-present';

export default function AddNewItemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages([...images, ...uris]);
    }
  };

  const uploadImagesToCloudinary = async () => {
    const urls = [];
    for (const uri of images) {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: `photo-${Date.now()}.jpg`,
      });
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'borrowbuddy_items');

      const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      urls.push(response.data.secure_url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!title || !price || !category || images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and upload at least one image.');
      return;
    }

    try {
      setUploading(true);
      const imageUrls = await uploadImagesToCloudinary();
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('http://192.168.238.74:5000/api/items/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: title,
          description,
          price,
          category,
          images: imageUrls,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Item listed successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImages([]);
      } else {
        Alert.alert('Error', data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Upload failed', 'Something went wrong while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>BorrowBuddy</Text> */}
        <Image source={require('../assets/logo.png')} style={styles.header} />
      <Text style={styles.title}>LIST ITEM</Text>

      <TouchableOpacity style={styles.imageUploadBox} onPress={pickImages}>
        {images.length === 0 ? (
          <Ionicons name="image" size={40} color="#888" />
        ) : (
          <ScrollView horizontal>
            {images.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.thumbnail}
              />
            ))}
          </ScrollView>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        <Text style={styles.submitButtonText}>{uploading ? 'Uploading...' : 'Submit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3c79',
    marginBottom: 12,
    alignSelf:"center",
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageUploadBox: {
    height: 150,
    backgroundColor: '#dbe3ea',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c2cbd3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#c2cbd3',
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#1a3c79',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});