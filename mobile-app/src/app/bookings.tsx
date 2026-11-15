import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function BookingsScreen() {
  const { token } = useLocalSearchParams(); 
  const router = useRouter();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar token nahi aaya toh aage mat badho
    if (!token) {
      Alert.alert("Error", "Chabi (Token) nahi mili!");
      setLoading(false);
      return;
    }

    fetch('http://10.16.67.196:8000/api/my-bookings/', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token 
      }
    })
    .then(response => response.json())
    .then(data => {
      // SAFETY CHECK: Check kar rahe hain ki backend se array (list) aayi hai ya error
      if (Array.isArray(data)) {
        setMyBookings(data);
      } else {
        console.error("Backend Error:", data);
        Alert.alert("Backend Error", "Bookings sahi format mein nahi aayi.");
        setMyBookings([]);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error("Network Error:", error);
      Alert.alert("Error", "Network problem.");
      setLoading(false);
    });
  }, [token]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f4f7f6', marginTop: 40 }}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: '#6c757d', padding: 10, borderRadius: 5, marginRight: 15 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>⬅ Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d6efd' }}>My Bookings</Text>
      </View>

      {loading ? <ActivityIndicator size="large" color="#0d6efd" /> : (
        myBookings.length === 0 ? (
          <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, color: 'red' }}>Koi booking nahi mili ya loading fail ho gayi.</Text>
        ) : (
          <FlatList
            data={myBookings}
            // Safely id nikalna taaki crash na ho
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 3, borderLeftWidth: 5, borderLeftColor: '#198754' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.service_name || "Unknown Service"}</Text>
                <Text style={{ fontSize: 16, color: '#333', marginTop: 5 }}>Name: {item.customer_name || "N/A"}</Text>
                <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>📅 Date: {item.date || "N/A"}   ⏰ Time: {item.time || "N/A"}</Text>
              </View>
            )}
          />
        )
      )}
    </View>
  );
}