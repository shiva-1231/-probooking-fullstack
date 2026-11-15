import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/config';
import {
  loginUser,
  signupUser,
  fetchServices,
  createOrder,
  fetchMyOrders,
  cancelOrder,
} from '../services/api';

import AuthCard from '../components/AuthCard';
import ServiceGrid from '../components/ServiceGrid';
import CartModal from '../components/CartModal';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';

export default function Home() {
  // Services & Category Navigation
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [token, setToken] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Screen Views
  const [showProfileView, setShowProfileView] = useState(false);
  const [showOrdersView, setShowOrdersView] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [showCartView, setShowCartView] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showUpiModal, setShowUpiModal] = useState(false);

  // Initial Load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [savedToken, savedUsername, savedPhone, savedAddress] = await AsyncStorage.multiGet([
          'userToken',
          'userName',
          'userPhone',
          'userAddress',
        ]);

        if (savedToken[1]) setToken(savedToken[1]);
        if (savedUsername[1]) setUsername(savedUsername[1]);
        if (savedPhone[1]) setPhoneNumber(savedPhone[1]);
        if (savedAddress[1]) setDeliveryAddress(savedAddress[1]);
      } catch (error) {
        console.error('Storage Load Error:', error);
      } finally {
        loadServices();
      }
    };

    initializeApp();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Services Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- CART LOGIC ---
  const addToCart = (serviceItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === serviceItem.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === serviceItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...serviceItem, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === serviceId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- AUTH HANDLERS ---
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username aur Password dono likhein!');
      return;
    }
    try {
      const data = await loginUser(username, password);
      if (data.access) {
        setToken(data.access);
        await AsyncStorage.multiSet([
          ['userToken', data.access],
          ['userName', username],
        ]);
        Alert.alert('Welcome!', 'Login Successful 🎉');

        setToken(data.access);
        Alert.alert('Welcome!', 'Login Successful 🎉');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Username ya Password galat hai!');
    }
  };

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Naya Username aur Password likhein!');
      return;
    }
    try {
      await signupUser(username, password);
      Alert.alert('Success! 🎉', 'Account ban gaya! Ab Login karein.');
      setIsLoginView(true);
    } catch (error) {
      Alert.alert('Signup Error', error.message || 'Account nahi ban paya.');
    }
  };

  // --- ORDER HANDLERS ---
  const submitOrderToBackend = async (selectedPaymentStatus, utr = '') => {
    const finalInstructions = utr
      ? `${instructions.trim()} [UPI Ref: ${utr}]`.trim()
      : instructions.trim();

    const orderPayload = {
      phone_number: phoneNumber.trim(),
      delivery_address: deliveryAddress.trim(),
      instructions: finalInstructions,
      payment_method: paymentMethod,
      payment_status: selectedPaymentStatus,
      items: cart.map((item) => ({
        service: item.id,
        quantity: item.quantity,
      })),
    };

    setIsPlacingOrder(true);
    try {
      const data = await createOrder(token, orderPayload);
      await AsyncStorage.multiSet([
        ['userPhone', phoneNumber.trim()],
        ['userAddress', deliveryAddress.trim()],
      ]);

      Alert.alert(
        'Order Confirmed! 🎉',
        `Order #${data.id} place ho gaya hai.\nAmount: ₹${data.total_amount} (${data.payment_method})`
      );
      setCart([]);
      setInstructions('');
      setShowCartView(false);
    } catch (error) {
      Alert.alert('Order Failed', error.message || 'Order place nahi ho paya.');
    } finally {
      setIsPlacingOrder(false);
      setShowUpiModal(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!token) {
      setShowCartView(false);
      Alert.alert('Login Zaroori Hai', 'Order place karne ke liye pehle Login karein!');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Pehle cart mein kuch items add karein.');
      return;
    }
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      Alert.alert('Mobile Number Missing', 'Kam se kam 10 digit ka mobile number daalein!');
      return;
    }
    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      Alert.alert('Address Missing', 'Apna poora delivery ya service address likhein!');
      return;
    }

    if (paymentMethod === 'ONLINE') {
      setShowUpiModal(true);
    } else {
      submitOrderToBackend('UNPAID');
    }
  };

  const handleOpenOrders = async () => {
    setShowOrdersView(true);
    setLoadingOrders(true);
    try {
      const data = await fetchMyOrders(token);
      setMyOrders(data);
    } catch (error) {
      Alert.alert('Error', 'Orders load nahi ho paye.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      'Cancel Order?',
      `Kya aap sach mein Order #${orderId} cancel karna chahte hain?`,
      [
        { text: 'Nahi', style: 'cancel' },
        {
          text: 'Haan, Cancel Karein',
          style: 'destructive',
          onPress: async () => {
            try {
              const data = await cancelOrder(token, orderId);
              Alert.alert('Cancelled', data.message);
              handleOpenOrders();
            } catch (error) {
              Alert.alert('Error', error.message || 'Order cancel nahi ho paya.');
            }
          },
        },
      ]
    );
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    const reorderedItems = order.items.map((orderItem) => ({
      id: orderItem.service,
      name: orderItem.service_name,
      price: parseFloat(orderItem.price),
      quantity: orderItem.quantity,
    }));
    setCart(reorderedItems);
    setShowOrdersView(false);
    setShowCartView(true);
  };

  // --- CONDITIONAL SCREENS ---
  if (showProfileView) {
    return (
      <ProfileScreen
        username={username}
        onBack={() => setShowProfileView(false)}
        onOpenOrders={() => {
          setShowProfileView(false);
          handleOpenOrders();
        }}
        onLogout={async () => {
          await AsyncStorage.multiRemove(['userToken', 'userName']);
          setToken(null);
          setShowProfileView(false);
          setIsLoginView(true);
        }}

      />
    );
  }

  if (showOrdersView) {
    return (
      <OrdersScreen
        orders={myOrders}
        loading={loadingOrders}
        onBack={() => setShowOrdersView(false)}
        onCancelOrder={handleCancelOrder}
        onReorder={handleReorder}
      />
    );
  }

  // --- MAIN HOME SCREEN ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={styles.title}>ProBooking</Text>
            <Text style={styles.subtitle}>Apni pasandida service book karein</Text>
          </View>

          {token && (
            <TouchableOpacity
              onPress={() => setShowProfileView(true)}
              style={{
                width: 45,
                height: 45,
                backgroundColor: COLORS.primary,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 22 }}>👤</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Auth Card */}
        {!token && (
          <AuthCard
            isLoginView={isLoginView}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onToggleView={() => setIsLoginView(!isLoginView)}
          />
        )}

        {/* Category Selection or Service Grid */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>1. Service Category Chunein</Text>

            {selectedCategory === null ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory('FOOD');
                    setSearchQuery('');
                  }}
                  style={{ flex: 1, backgroundColor: COLORS.food, padding: 20, borderRadius: 16, marginRight: 10, alignItems: 'center', elevation: 4 }}
                >
                  <Ionicons name="fast-food" size={40} color="white" style={{ marginBottom: 10 }} />
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                    Hotel & Food
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory('ELEC');
                    setSearchQuery('');
                  }}
                  style={{ flex: 1, backgroundColor: COLORS.elec, padding: 20, borderRadius: 16, marginLeft: 10, alignItems: 'center', elevation: 4 }}
                >
                  <Ionicons name="flash" size={40} color="white" style={{ marginBottom: 10 }} />
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                    Electrician
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ServiceGrid
                services={services}
                selectedCategory={selectedCategory}
                onBackToCategories={() => setSelectedCategory(null)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                cart={cart}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
              />
            )}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            elevation: 6,
          }}
        >
          <View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
              {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} Added
            </Text>
            <Text style={{ color: '#E0E7FF', fontSize: 13 }}>Total: ₹{cartTotal}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowCartView(true)}
            style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }}>View Cart ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart & Checkout Modal */}
      <CartModal
        visible={showCartView}
        onClose={() => setShowCartView(false)}
        cart={cart}
        cartTotal={cartTotal}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={isPlacingOrder}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        instructions={instructions}
        setInstructions={setInstructions}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        showUpiModal={showUpiModal}
        setShowUpiModal={setShowUpiModal}
        onConfirmOnlinePayment={(utr) => submitOrderToBackend('UNPAID', utr)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.primary },
  subtitle: { fontSize: 16, color: 'gray' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
});