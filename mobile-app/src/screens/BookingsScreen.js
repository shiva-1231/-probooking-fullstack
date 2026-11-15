import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/config';

export default function BookingsScreen({ bookings, loading, onBack, onCancelBooking }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, padding: 20, marginTop: 30 }}>
        {/* Header & Back Button */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
          <TouchableOpacity
            onPress={onBack}
            style={{ backgroundColor: COLORS.surface, padding: 10, borderRadius: 12, marginRight: 15 }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.primary }}>My Bookings</Text>
        </View>

        {/* Bookings List */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : bookings.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray', marginTop: 50 }}>
            Koi booking nahi mili 📦
          </Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: COLORS.surface, padding: 18, borderRadius: 12, marginBottom: 15, elevation: 2 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>Booking #{item.id}</Text>
                <Text style={{ fontSize: 16, color: COLORS.primary, marginTop: 5 }}>Name: {item.customer_name}</Text>
                <Text style={{ color: 'gray', marginTop: 5 }}>📅 {item.booking_date}  ⏰ {item.booking_time}</Text>

                {/* Cancel Button */}
                {item.status !== 'CANCELLED' && (
                  <TouchableOpacity
                    onPress={() => onCancelBooking(item.id)}
                    style={{
                      backgroundColor: '#FEE2E2',
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      borderRadius: 8,
                      marginTop: 12,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 13 }}>✕ Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}