import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/config';

export default function OrdersScreen({
  orders,
  loading,
  onBack,
  onCancelOrder,
  onReorder,
}) {
  // Status ke hisaab se badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'DELIVERED':
        return { bg: '#D1FAE5', text: '#047857' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default: // PENDING
        return { bg: '#FEF3C7', text: '#D97706' };
    }
  };

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
          <Text style={{ fontSize: 26, fontWeight: '900', color: COLORS.primary }}>My Orders</Text>
        </View>

        {/* Orders List */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : orders.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 18, color: 'gray', marginTop: 50 }}>
            Abhi tak koi order nahi hai 🛍️
          </Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const statusColors = getStatusStyle(item.status);

              return (
                <View style={{ backgroundColor: COLORS.surface, padding: 18, borderRadius: 14, marginBottom: 15, elevation: 2 }}>
                  {/* Order Header: ID & Dynamic Status Badge */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text }}>
                      Order #{item.id}
                    </Text>
                    <View style={{ backgroundColor: statusColors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ color: statusColors.text, fontWeight: 'bold', fontSize: 12 }}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Order Date */}
                  <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>
                    🕒 {new Date(item.created_at).toLocaleString()}
                  </Text>

                  {/* Delivery Address & Phone */}
                  {item.delivery_address ? (
                    <Text style={{ fontSize: 13, color: COLORS.text, marginBottom: 10 }}>
                      📍 {item.delivery_address} ({item.phone_number})
                    </Text>
                  ) : null}

                  {/* Order Items Breakdown */}
                  <View style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 12 }}>
                    {item.items && item.items.map((orderItem) => (
                      <View key={orderItem.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, color: COLORS.text }}>
                          {orderItem.quantity}x {orderItem.service_name}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
                          ₹{orderItem.price * orderItem.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Total Bill & Payment Info */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }}>
                    <View>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>Payment</Text>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: item.payment_status === 'PAID' ? COLORS.success : COLORS.text }}>
                        {item.payment_method === 'ONLINE' ? '💳 UPI/Online' : '💵 Cash on Delivery'} ({item.payment_status})
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 12, color: COLORS.textLight }}>Total</Text>
                      <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.success }}>₹{item.total_amount}</Text>
                    </View>
                  </View>


                  {/* Action Buttons: Cancel (sirf PENDING ke liye) & Re-order */}
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, gap: 10 }}>
                    {item.status === 'PENDING' && (
                      <TouchableOpacity
                        onPress={() => onCancelOrder(item.id)}
                        style={{
                          backgroundColor: '#FEE2E2',
                          paddingVertical: 8,
                          paddingHorizontal: 14,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 13 }}>
                          ✕ Cancel Order
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => onReorder(item)}
                      style={{
                        backgroundColor: '#E0E7FF',
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 13 }}>
                        🔄 Re-order
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}