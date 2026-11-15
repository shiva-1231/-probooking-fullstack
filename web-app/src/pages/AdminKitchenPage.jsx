import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchStaffOrders, updateStaffOrder, toggleServiceStock } from '../services/api';

function playOrderAlertSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Audio alert blocked until user clicks page:', e);
  }
}

export default function AdminKitchenPage({ token, services, onRefreshServices }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ORDERS'); // 'ORDERS' | 'STOCK'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const highestOrderIdRef = useRef(null);

  const loadAllOrders = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await fetchStaffOrders(token);
        setOrders(data);

        if (data.length > 0) {
          const maxId = Math.max(...data.map((o) => o.id));
          if (highestOrderIdRef.current !== null && maxId > highestOrderIdRef.current && soundEnabled) {
            playOrderAlertSound();
          }
          highestOrderIdRef.current = maxId;
        }
      } catch (err) {
        console.error('Staff orders fetch error:', err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token, soundEnabled]
  );

  useEffect(() => {
    if (!token) return;
    loadAllOrders(false);
    const interval = setInterval(() => loadAllOrders(true), 5000);
    return () => clearInterval(interval);
  }, [token, loadAllOrders]);

  const handleStatusChange = async (orderId, updates) => {
    try {
      await updateStaffOrder(token, orderId, updates);
      loadAllOrders(true);
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const handleStockToggle = async (serviceId) => {
    try {
      await toggleServiceStock(token, serviceId);
      if (onRefreshServices) onRefreshServices();
    } catch (err) {
      alert(err.message || 'Stock toggle failed');
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A' }}>
            👨‍🍳 Kitchen & Operations Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Live Order Queue ({pendingCount} Pending) & Instant Stock Manager
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playOrderAlertSound();
            }}
            style={{
              background: soundEnabled ? '#DCFCE7' : '#F1F5F9',
              color: soundEnabled ? '#15803D' : '#475569',
              border: 'none',
              padding: '9px 14px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {soundEnabled ? '🔔 Sound Alert: ON' : '🔕 Sound Alert: OFF'}
          </button>

          <button
            onClick={() => setActiveTab('ORDERS')}
            style={{
              background: activeTab === 'ORDERS' ? '#4F46E5' : '#FFFFFF',
              color: activeTab === 'ORDERS' ? '#FFFFFF' : '#334155',
              border: '1px solid #CBD5E1',
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            📋 Live Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('STOCK')}
            style={{
              background: activeTab === 'STOCK' ? '#4F46E5' : '#FFFFFF',
              color: activeTab === 'STOCK' ? '#FFFFFF' : '#334155',
              border: '1px solid #CBD5E1',
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            📦 Menu Stock ({services.length})
          </button>
        </div>
      </div>

      {activeTab === 'ORDERS' ? (
        loading ? (
          <p>Loading incoming orders...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  border: order.status === 'PENDING' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: '900', fontSize: '18px' }}>Order #{order.id}</span>
                    <span style={{ marginLeft: '8px', fontSize: '13px', color: '#4F46E5', fontWeight: '700' }}>
                      @{order.customer_username}
                    </span>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '800',
                      background: order.status === 'DELIVERED' ? '#DCFCE7' : order.status === 'CANCELLED' ? '#FEE2E2' : '#FEF3C7',
                      color: order.status === 'DELIVERED' ? '#15803D' : order.status === 'CANCELLED' ? '#B91C1C' : '#B45309',
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <strong>
                        {item.service_name} × {item.quantity}
                      </strong>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: '13px', color: '#334155', marginBottom: '4px' }}>
                  📞 <strong>{order.phone_number}</strong> • 📍 {order.delivery_address}
                </p>
                {order.preferred_slot && (
                  <p style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: '700', marginBottom: '4px' }}>
                    ⏰ Slot: {order.preferred_slot}
                  </p>
                )}
                {order.instructions && (
                  <p style={{ fontSize: '13px', color: '#B45309', marginBottom: '6px' }}>
                    📝 Note: {order.instructions}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
                  <strong style={{ fontSize: '17px', color: '#0F172A' }}>Total: ₹{order.total_amount}</strong>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      color: order.payment_status === 'PAID' ? '#16A34A' : '#DC2626',
                    }}
                  >
                    {order.payment_method} • {order.payment_status}
                  </span>
                </div>

                {/* Quick Action Buttons */}
                {order.status !== 'CANCELLED' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(order.id, { status: 'CONFIRMED' })}
                        style={{
                          background: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✅ Accept Order
                      </button>
                    )}

                    {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleStatusChange(order.id, { status: 'OUT_FOR_DELIVERY' })}
                        style={{
                          background: '#7C3AED',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        🛵 Out for Delivery
                      </button>
                    )}

                    {order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleStatusChange(order.id, { status: 'DELIVERED' })}
                        style={{
                          background: '#16A34A',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        🎉 Mark Delivered
                      </button>
                    )}

                    {order.payment_status === 'UNPAID' && (
                      <button
                        onClick={() => handleStatusChange(order.id, { payment_status: 'PAID' })}
                        style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          border: '1px solid #FDE68A',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        💵 Mark Paid
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Stock Manager Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {services.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A' }}>{item.name}</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  ₹{item.price} • {item.category}
                </p>
              </div>
              <button
                onClick={() => handleStockToggle(item.id)}
                style={{
                  background: item.is_available ? '#DCFCE7' : '#FEE2E2',
                  color: item.is_available ? '#15803D' : '#DC2626',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {item.is_available ? '● In Stock' : '✕ Sold Out'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
