import React, { useState } from 'react';
import { createOrder } from '../services/api';

const TIME_SLOTS = [
  'Within 60 Minutes (Urgent)',
  'Today, 10:00 AM – 12:00 PM',
  'Today, 12:00 PM – 03:00 PM',
  'Today, 04:00 PM – 07:00 PM',
  'Tomorrow, 10:00 AM – 12:00 PM',
  'Tomorrow, 04:00 PM – 07:00 PM',
];

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onAdd,
  onRemove,
  onClearCart,
  token,
  onRequireLogin,
  onOrderSuccess,
}) {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const hasElectricianItem = cart.some((item) => item.category === 'ELEC');
  const deliveryFee = cartTotal >= 199 || cartTotal === 0 ? 0 : 20;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      onClose();
      onRequireLogin();
      return;
    }

    if (!phone.trim() || !address.trim()) {
      setError('Mobile number aur delivery address zaroori hai.');
      return;
    }

    if (paymentMethod === 'ONLINE' && !utrNumber.trim()) {
      setError('UPI payment ke baad 12-digit UTR / Reference number darj karein.');
      return;
    }

    const finalInstructions =
      paymentMethod === 'ONLINE'
        ? `[UPI UTR: ${utrNumber.trim()}] ${instructions}`.trim()
        : instructions.trim();

    const payload = {
      phone_number: phone.trim(),
      delivery_address: address.trim(),
      instructions: finalInstructions,
      preferred_slot: hasElectricianItem ? preferredSlot : '',
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'ONLINE' ? 'PAID' : 'UNPAID',
      items: cart.map((item) => ({
        service: item.id,
        quantity: item.quantity,
      })),
    };

    setSubmitting(true);
    try {
      const created = await createOrder(token, payload);
      onClearCart();
      setUtrNumber('');
      onClose();
      alert(`🎉 Order #${created.id} successfully placed!`);
      onOrderSuccess();
    } catch (err) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err?.message && typeof err.message === 'string' && err.message !== '[object Object]') {
        setError(err.message);
      } else {
        setError(JSON.stringify(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>🛒 Your Cart</h2>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px', color: '#64748B' }}>
            <p style={{ fontSize: '42px', marginBottom: '10px' }}>🛍️</p>
            <p style={{ fontWeight: '600', fontSize: '16px' }}>Aapka cart abhi khali hai</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Menu se apni pasand ke items add karein!</p>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress Banner */}
            <div
              style={{
                background: deliveryFee === 0 ? '#F0FDF4' : '#FFFBEB',
                border: `1px solid ${deliveryFee === 0 ? '#BBF7D0' : '#FDE68A'}`,
                color: deliveryFee === 0 ? '#15803D' : '#B45309',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                marginTop: '14px',
              }}
            >
              {deliveryFee === 0
                ? '🎉 Congratulations! You unlocked FREE Delivery!'
                : `🚚 Add items worth ₹${199 - cartTotal} more for FREE Delivery!`}
            </div>

            {/* Cart Items List */}
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px' }}>{item.name}</p>
                    <p style={{ color: '#64748B', fontSize: '13px' }}>
                      ₹{item.price} × {item.quantity} = <strong>₹{item.price * item.quantity}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '800', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#4F46E5',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} style={{ marginTop: '20px', borderTop: '1px solid #E2E8F0', paddingTop: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>Delivery & Service Details</h3>

              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    color: '#DC2626',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                  Delivery / Service Address *
                </label>
                <textarea
                  rows="2"
                  placeholder="House No, Street, Landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>

              {/* Electrician Time-Slot Selector (Shown automatically if Electrician item in cart) */}
              {hasElectricianItem && (
                <div
                  style={{
                    marginBottom: '12px',
                    background: '#EFF6FF',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#1D4ED8', marginBottom: '6px' }}>
                    ⚡ Electrician Visit Time-Slot *
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      border: '1px solid #93C5FD',
                      background: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Jaise: Extra spicy, gate par call karein..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: paymentMethod === 'COD' ? '2px solid #4F46E5' : '1px solid #CBD5E1',
                      background: paymentMethod === 'COD' ? '#EEF2FF' : '#FFFFFF',
                      fontWeight: '700',
                      color: paymentMethod === 'COD' ? '#4F46E5' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    💵 Cash on Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: paymentMethod === 'ONLINE' ? '2px solid #4F46E5' : '1px solid #CBD5E1',
                      background: paymentMethod === 'ONLINE' ? '#EEF2FF' : '#FFFFFF',
                      fontWeight: '700',
                      color: paymentMethod === 'ONLINE' ? '#4F46E5' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    📲 UPI Online
                  </button>
                </div>
              </div>

              {paymentMethod === 'ONLINE' && (
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '14px',
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#166534' }}>
                    UPI ID par ₹{grandTotal} pay karein:
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: '900', color: '#15803D', margin: '4px 0 8px' }}>
                    probooking@upi
                  </p>
                  <input
                    type="text"
                    placeholder="12-digit UPI UTR / Ref No. darj karein *"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #86EFAC' }}
                  />
                </div>
              )}

              {/* Bill Summary */}
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '14px',
                  fontSize: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#475569' }}>
                  <span>Item Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: deliveryFee === 0 ? '#16A34A' : '#475569' }}>
                  <span>Delivery / Visit Charge</span>
                  <strong>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #CBD5E1',
                    paddingTop: '8px',
                    fontSize: '17px',
                    fontWeight: '900',
                    color: '#0F172A',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: '#4F46E5' }}>₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: '#16A34A',
                  color: 'white',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {submitting
                  ? 'Placing Order...'
                  : token
                  ? `Confirm Order (₹${grandTotal}) ➔`
                  : 'Login to Confirm Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
