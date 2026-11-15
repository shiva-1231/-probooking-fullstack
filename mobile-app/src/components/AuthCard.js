import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/config';

export default function AuthCard({
  isLoginView,
  username,
  setUsername,
  password,
  setPassword,
  onLogin,
  onSignup,
  onToggleView,
}) {
  return (
    <View style={{ backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, marginBottom: 25, elevation: 3 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 }}>
        {isLoginView ? 'Login to Book' : 'Create an Account'}
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 15 }}
      />

      <TouchableOpacity
        onPress={isLoginView ? onLogin : onSignup}
        style={{ backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          {isLoginView ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggleView} style={{ marginTop: 15, alignItems: 'center' }}>
        <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
          {isLoginView ? 'Naya account banayein?' : 'Pehle se account hai? Login karein'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}