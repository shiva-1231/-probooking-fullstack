import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/config';

export default function BookingDetailsForm({
  customerName,
  setCustomerName,
  bookingDate,
  bookingTime,
  dateObj,
  showDatePicker,
  setShowDatePicker,
  showTimePicker,
  setShowTimePicker,
  onChangeDate,
  onChangeTime,
}) {
  return (
    <View style={{ backgroundColor: COLORS.surface, padding: 20, borderRadius: 16, marginBottom: 25, elevation: 3 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 }}>
        Booking Details
      </Text>

      <TextInput
        placeholder="Apna Naam Likhein"
        value={customerName}
        onChangeText={setCustomerName}
        style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, marginBottom: 15 }}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ flex: 1, backgroundColor: '#E0E7FF', padding: 12, borderRadius: 8, marginRight: 8, alignItems: 'center' }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
            {bookingDate || 'Select Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={{ flex: 1, backgroundColor: '#E0E7FF', padding: 12, borderRadius: 8, marginLeft: 8, alignItems: 'center' }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
            {bookingTime || 'Select Time'}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker value={dateObj} mode="date" display="default" onChange={onChangeDate} />
      )}
      {showTimePicker && (
        <DateTimePicker value={dateObj} mode="time" display="default" onChange={onChangeTime} />
      )}
    </View>
  );
}
