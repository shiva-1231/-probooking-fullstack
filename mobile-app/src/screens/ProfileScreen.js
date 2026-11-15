import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/config';

export default function ProfileScreen({
  username,
  onBack,
  onOpenOrders,
  onLogout,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, padding: 20, marginTop: 30, alignItems: 'center' }}>
        {/* Back Button */}
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 30 }}>
          <TouchableOpacity
            onPress={onBack}
            style={{ backgroundColor: 'white', padding: 10, borderRadius: 12, elevation: 2 }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Photo & Info */}
        <View style={{ width: 120, height: 120, backgroundColor: COLORS.primary, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 50 }}>👤</Text>
        </View>

        <Text style={{ fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 5 }}>
          {username || 'Guest'}
        </Text>
        <Text style={{ fontSize: 16, color: 'gray', marginBottom: 40 }}>Premium Member 🌟</Text>

        {/* My Orders Button */}
        <TouchableOpacity
          onPress={onOpenOrders}
          style={{ backgroundColor: COLORS.success, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, width: '80%', alignItems: 'center', elevation: 2, marginBottom: 20 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>🛍️ My Orders</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={onLogout}
          style={{ backgroundColor: '#FEE2E2', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, width: '80%', alignItems: 'center' }}
        >
          <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 18 }}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}