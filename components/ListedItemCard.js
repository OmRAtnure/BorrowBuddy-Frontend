// components/ListedItemCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ListedItemCard = ({ item, onRemove, status }) => {
  if (!item || !item.images || item.images.length === 0) return null;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.images[0] }} // using URI-based image from Firebase
        style={styles.image}
      />
      <View style={styles.details}>
        <View style={styles.flexcard}>
            <View>
            { status && <Text style={styles.title}>{item.name}</Text>}
            { !status && <Text style={styles.title}>{item.item_name}</Text>}
            {status && <Text style={styles.price}>₹{item.price}</Text>}
            </View>
            <View>
            {status && <> <Text style={styles.status}>
              Status: 
            </Text>
            <Text>{item.available ? 'Not Rented' : 'Rented'}</Text> </>}
            </View>
        </View>
        
        {status ? (
  item.available ? (
    <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
      <Text style={styles.removeText}>Remove</Text>
    </TouchableOpacity>
  ) : (
    <View style={[styles.removeButton, { backgroundColor: '#dfe6e9' }]}>
      <Text style={[styles.removeText, { color: '#636e72' }]}>Rented</Text>
    </View>
  )
) : (
  <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
    <Text style={styles.removeText}>Return</Text>
  </TouchableOpacity>
)}

      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#dfe6e9',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff4757',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
  },
  flexcard:{
    display:"flex",
    flexDirection:"row",
    flexBasis:20,
    justifyContent:"space-between",
    paddingRight:10,
    // backgroundColor:"red",
  },
});

export default ListedItemCard;
