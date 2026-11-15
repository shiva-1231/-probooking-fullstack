import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { COLORS, MERCHANT_UPI_ID, MERCHANT_NAME } from '../constants/config';

export default function CartModal({
  visible,
  onClose,
  cart,
  cartTotal,
  onAdd,
  onRemove,
  onPlaceOrder,
  isPlacingOrder,
  phoneNumber,
  setPhoneNumber,
  deliveryAddress,
  setDeliveryAddress,
  instructions,
  setInstructions,
  paymentMethod,
  setPaymentMethod,
  showUpiModal,
  setShowUpiModal,
  onConfirmOnlinePayment,
}) {
  const [utrNumber, setUtrNumber] = useState('');

  // Asli UPI Apps (GPay, PhonePe, Paytm) Launch Karne Ka Function
  const handleLaunchUpiApp = async () => {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(
      MERCHANT_NAME
    )}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent('ProBooking Order')}`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          'UPI App Nahi Mila',
          'Is phone mein koi UPI app (GPay/PhonePe/Paytm) installed nahi hai, ya emulator par chal raha hai.'
        );
      }
    } catch (error) {
      console.error('UPI Launch Error:', error);
      Alert.alert('Error', 'UPI app open karne mein dikkat aayi.');
    }
  };

  const handleVerifyAndSubmit = () => {
    if (!utrNumber || utrNumber.trim().length < 6) {
      Alert.alert(
        'UTR / Ref ID Required',
        'Payment karne ke baad UPI Transaction / UTR ID (kam se kam 6 digits) daalein.'
      );
      return;
    }
    const cleanUtr = utrNumber.trim();
    setUtrNumber('');
    onConfirmOnlinePayment(cleanUtr);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text }}>Your Cart 🛒</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={{ backgroundColor: '#F3F4F6', padding: 8, borderRadius: 20 }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.textLight }}>✕</Text>
            </TouchableOpacity>
          </View>

          {cart.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 16, color: COLORS.textLight }}>Your cart is empty!</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Cart Items List */}
              {cart.map((item) => (
                <View 
                  key={item.id} 
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.text }}>{item.name}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>₹{item.price} each</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 }}>
                    <TouchableOpacity 
                      onPress={() => onRemove(item.id)} 
                      style={{ backgroundColor: COLORS.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>-</Text>
                    </TouchableOpacity>

                    <Text style={{ marginHorizontal: 12, fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>{item.quantity}</Text>

                    <TouchableOpacity 
                      onPress={() => onAdd(item)} 
                      style={{ backgroundColor: COLORS.primary, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ width: 65, textAlign: 'right', fontWeight: 'bold', fontSize: 15, color: COLORS.text }}>
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              ))}

              {/* Bill Summary */}
              <View style={{ marginTop: 15, backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: COLORS.textLight }}>Items Subtotal</Text>
                  <Text style={{ fontWeight: 'bold', color: COLORS.text }}>₹{cartTotal}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: COLORS.textLight }}>Delivery / Visit Fee</Text>
                  <Text style={{ fontWeight: 'bold', color: COLORS.success }}>FREE</Text>
                </View>
                <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text }}>Total Amount</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.primary }}>₹{cartTotal}</Text>
                </View>
              </View>

              {/* Delivery & Contact Details */}
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>
                  📍 Delivery / Service Details
                </Text>

                <TextInput
                  placeholder="Mobile Number (10 digits) *"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 10, fontSize: 14 }}
                />

                <TextInput
                  placeholder="Complete Address / House No. / Landmark *"
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                  multiline
                  numberOfLines={2}
                  style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, marginBottom: 10, fontSize: 14, textAlignVertical: 'top' }}
                />

                <TextInput
                  placeholder="Special Instructions / Preferred Time (Optional)"
                  value={instructions}
                  onChangeText={setInstructions}
                  style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 10, fontSize: 14 }}
                />
              </View>

              {/* Payment Method Selector */}
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 }}>
                  💰 Select Payment Method
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setPaymentMethod('COD')}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: paymentMethod === 'COD' ? COLORS.primary : '#E5E7EB',
                      backgroundColor: paymentMethod === 'COD' ? '#EEF2FF' : 'white',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>💵</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: paymentMethod === 'COD' ? COLORS.primary : COLORS.text }}>
                      Cash on Delivery
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>Pay at doorstep</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPaymentMethod('ONLINE')}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: paymentMethod === 'ONLINE' ? COLORS.primary : '#E5E7EB',
                      backgroundColor: paymentMethod === 'ONLINE' ? '#EEF2FF' : 'white',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>💳</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: paymentMethod === 'ONLINE' ? COLORS.primary : COLORS.text }}>
                      Online / UPI
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>GPay, PhonePe, UPI</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Checkout Button */}
              <TouchableOpacity
                onPress={onPlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  backgroundColor: isPlacingOrder ? COLORS.textLight : COLORS.primary,
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 20,
                  marginBottom: 15,
                }}
              >
                {isPlacingOrder ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                    {paymentMethod === 'ONLINE'
                      ? `Proceed to Pay ₹${cartTotal} 💳`
                      : `Confirm & Place Order (₹${cartTotal})`}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>

      {/* REAL UPI DEEP LINK + UTR VERIFICATION MODAL */}
      <Modal
        visible={showUpiModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUpiModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', width: '100%', borderRadius: 20, padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 1 }}>
              DIRECT UPI PAYMENT
            </Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: COLORS.text, marginVertical: 8 }}>
              ₹{cartTotal}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, textAlign: 'center', marginBottom: 16 }}>
              Pay to: {MERCHANT_UPI_ID}
            </Text>

            {/* Step 1: Open Real UPI App */}
            <TouchableOpacity
              onPress={handleLaunchUpiApp}
              style={{
                backgroundColor: '#EEF2FF',
                borderWidth: 1.5,
                borderColor: COLORS.primary,
                width: '100%',
                paddingVertical: 13,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 15 }}>
                📲 1. Open GPay / PhonePe / Paytm
              </Text>
            </TouchableOpacity>

            {/* Step 2: Enter UTR after paying */}
            <Text style={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 }}>
              2. Payment ke baad UPI Ref / UTR Number daalein:
            </Text>
            <TextInput
              placeholder="Enter 12-digit UTR / Ref No."
              value={utrNumber}
              onChangeText={setUtrNumber}
              keyboardType="number-pad"
              maxLength={16}
              style={{
                backgroundColor: '#F3F4F6',
                width: '100%',
                padding: 12,
                borderRadius: 10,
                marginBottom: 16,
                fontSize: 14,
              }}
            />

            <TouchableOpacity
              onPress={handleVerifyAndSubmit}
              disabled={isPlacingOrder}
              style={{ backgroundColor: COLORS.success, width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 }}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  ✅ Submit UTR & Place Order
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowUpiModal(false)}
              disabled={isPlacingOrder}
              style={{ paddingVertical: 8 }}
            >
              <Text style={{ color: COLORS.danger, fontWeight: 'bold', fontSize: 14 }}>
                ❌ Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}