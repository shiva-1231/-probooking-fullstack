import React, { useState, useEffect, useCallback } from 'react';
import { fetchMyOrders, cancelOrder, rateOrder } from '../services/api';

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: '🕒' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: '✅' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: '🛵' },
  { key: 'DELIVERED', label: 'Delivered', icon: '🎉' },
];

function getStepIndex(status) {
  if (status === 'DELIVERED' || status === 'COMPLETED') return 3;
  if (status === 'OUT_FOR_DELIVERY' || status === 'IN_PROGRESS') return 2;
  if (status === 'CONFIRMED' || status === 'ACCEPTED') return 1;
  return 0;
}

export default function MyOrdersView({ token, onReorder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState('');
  const [ratingDrafts, setRatingDrafts] = useState({});
  const [submittingRatingId, setSubmittingRatingId] = useState(null);

  const loadOrders = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await fetchMyOrders(token);
        setOrders(data);
        const now = new Date();
        setLastSynced(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Orders load error:', err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) return;
    loadOrders(false);

    const intervalId = setInterval(() => {
      loadOrders(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, loadOrders]);

  const handleCancel = async (orderId) => {
    if (!window.confirm(`Kya aap sach mein Order #${orderId} cancel karna chahte hain?`)) return;
    try {
      const res = await cancelOrder(token, orderId);
      alert(res.message || 'Order cancelled');
      loadOrders(false);
    } catch (err) {
      alert(err.message || 'Order cancel nahi ho paya.');
    }
  };

  const handleRatingSubmit = async (orderId) => {
    const draft = ratingDrafts[orderId] || { rating: 5, review: '' };
    setSubmittingRatingId(orderId);
    try {
      await rateOrder(token, orderId, draft.rating || 5, draft.review || '');
      alert('⭐ Thank you! Aapki rating save ho gayi hai.');
      loadOrders(false);
    } catch (err) {
      alert(err.message || 'Rating submit nahi ho payi.');
    } finally {
      setSubmittingRatingId(null);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px' }}>Loading your orders...</p>;

  return (
    <div>
      {/* Header with Live Sync Badge */}
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
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A' }}>
            🛍️ My Orders ({orders.length})
          </h2>
          {lastSynced && (
            <p style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700', marginTop: '2px' }}>
              🟢 Live Auto-Sync Active • Last updated at {lastSynced}
            </p>
          )}
        </div>

        <button
          onClick={() => loadOrders(false)}
          style={{
            background: '#EEF2FF',
            color: '#4F46E5',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh Now
        </button>
      </div>

      {orders.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            padding: '50px',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
          }}
        >
          <p style={{ fontSize: '40px', marginBottom: '10px' }}>📦</p>
          <p style={{ fontWeight: '700', fontSize: '18px' }}>Abhi tak koi order nahi hai</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {orders.map((order) => {
            const isCancelled = order.status === 'CANCELLED';
            const isDelivered = order.status === 'DELIVERED' || order.status === 'COMPLETED';
            const currentStep = getStepIndex(order.status);
            const currentDraft = ratingDrafts[order.id] || { rating: 5, review: '' };

            return (
              <div
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Order Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: '900', fontSize: '17px', color: '#0F172A' }}>Order #{order.id}</span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '800',
                      background: isDelivered ? '#DCFCE7' : isCancelled ? '#FEE2E2' : '#FEF3C7',
                      color: isDelivered ? '#15803D' : isCancelled ? '#B91C1C' : '#B45309',
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Live 4-Step Visual Progress Tracker */}
                {!isCancelled && (
                  <div
                    style={{
                      background: '#F8FAFC',
                      padding: '12px 10px',
                      borderRadius: '12px',
                      marginBottom: '14px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {ORDER_STEPS.map((step, index) => {
                        const completed = index <= currentStep;
                        return (
                          <div
                            key={step.key}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              zIndex: 1,
                            }}
                          >
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: completed ? '#4F46E5' : '#E2E8F0',
                                color: completed ? '#FFFFFF' : '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: '800',
                                marginBottom: '4px',
                              }}
                            >
                              {completed ? step.icon : index + 1}
                            </div>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: completed ? '800' : '600',
                                color: completed ? '#1E293B' : '#94A3B8',
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '10px 0', marginBottom: '12px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                      <span>
                        {item.service_name} × {item.quantity}
                      </span>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                  {parseFloat(order.delivery_fee || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      <span>Delivery Charge</span>
                      <span>₹{order.delivery_fee}</span>
                    </div>
                  )}
                </div>

                {/* Slot, Address & Payment */}
                {order.preferred_slot && (
                  <p style={{ fontSize: '13px', color: '#1D4ED8', fontWeight: '700', marginBottom: '4px' }}>
                    ⏰ Slot: {order.preferred_slot}
                  </p>
                )}
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>
                  📍 {order.delivery_address}
                </p>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
                  💳 {order.payment_method} ({order.payment_status})
                </p>

                {/* Rating & Review Box for Delivered Orders */}
                {isDelivered && (
                  <div
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    {order.rating ? (
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '800', color: '#B45309' }}>
                          Your Rating: {'⭐'.repeat(order.rating)} ({order.rating}/5)
                        </p>
                        {order.review && (
                          <p style={{ fontSize: '13px', color: '#78350F', marginTop: '4px' }}>"{order.review}"</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '800', color: '#92400E', marginBottom: '6px' }}>
                          Rate Your Experience:
                        </p>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRatingDrafts((prev) => ({
                                  ...prev,
                                  [order.id]: { ...currentDraft, rating: star },
                                }))
                              }
                              style={{
                                background: currentDraft.rating >= star ? '#F59E0B' : '#FEF3C7',
                                color: currentDraft.rating >= star ? '#FFFFFF' : '#92400E',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 9px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                fontSize: '13px',
                              }}
                            >
                              ★ {star}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Write short feedback..."
                            value={currentDraft.review}
                            onChange={(e) =>
                              setRatingDrafts((prev) => ({
                                ...prev,
                                [order.id]: { ...currentDraft, review: e.target.value },
                              }))
                            }
                            style={{
                              flex: 1,
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: '1px solid #FCD34D',
                              fontSize: '13px',
                            }}
                          />
                          <button
                            type="button"
                            disabled={submittingRatingId === order.id}
                            onClick={() => handleRatingSubmit(order.id)}
                            style={{
                              background: '#D97706',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '7px 12px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Total & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <strong style={{ fontSize: '18px', color: '#4F46E5' }}>Total: ₹{order.total_amount}</strong>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        style={{
                          background: '#FEE2E2',
                          color: '#DC2626',
                          border: 'none',
                          padding: '7px 12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => onReorder(order)}
                      style={{
                        background: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      🔄 Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
