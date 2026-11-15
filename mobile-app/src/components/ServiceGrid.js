import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';

export default function ServiceGrid({
  services,
  selectedCategory,
  onBackToCategories,
  searchQuery,
  setSearchQuery,
  cart,
  onAddToCart,
  onRemoveFromCart,
}) {
  const filteredServices = services.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      {/* Back to Categories Button */}
      <TouchableOpacity
        onPress={onBackToCategories}
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 8 }}
      >
        <Ionicons name="arrow-undo" size={20} color={COLORS.primary} style={{ marginRight: 5 }} />
        <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Categories Par Wapas Jayein</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={{ backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15, elevation: 2, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
        <TextInput
          placeholder="Apna favorite item dhoondhein..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ flex: 1, fontSize: 16 }}
          placeholderTextColor="gray"
        />
      </View>

      {/* 2-Column Service Items FlatList */}
      <FlatList
        scrollEnabled={false}
        numColumns={2}
        key="2-columns"
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const inCart = cart.find((c) => c.id === item.id);

          return (
            <View style={{ backgroundColor: 'white', borderRadius: 15, padding: 10, marginBottom: 15, width: '48%', elevation: 3 }}>
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: '100%', height: 100, borderRadius: 10, marginBottom: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ width: '100%', height: 100, backgroundColor: '#E5E7EB', borderRadius: 10, marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>No Image</Text>
                </View>
              )}

              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 }} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.success, marginBottom: 10 }}>
                ₹{item.price}
              </Text>

              {/* Cart Control: Add or Qty Selector */}
              {inCart ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 }}>
                  <TouchableOpacity
                    onPress={() => onRemoveFromCart(item.id)}
                    style={{ backgroundColor: COLORS.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>-</Text>
                  </TouchableOpacity>

                  <Text style={{ fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>
                    {inCart.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => onAddToCart(item)}
                    style={{ backgroundColor: COLORS.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => onAddToCart(item)}
                  style={{ backgroundColor: COLORS.primary, padding: 8, borderRadius: 8, alignItems: 'center' }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Add +</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}