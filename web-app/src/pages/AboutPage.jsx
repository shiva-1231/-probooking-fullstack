import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
      >
        <span
          style={{
            background: '#EEF2FF',
            color: '#4F46E5',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '800',
          }}
        >
          ABOUT PROBOOKING
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#0F172A', margin: '14px 0 12px' }}>
          One Platform for Daily Cravings & Home Repairs
        </h1>
        <p style={{ color: '#475569', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px' }}>
          ProBooking was built with a simple mission: bring hot, hygienic hotel food (momos, rolls, samosas, sweets, burgers, and besan laddus) and trusted local electrician services together in a single fast app and website.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          <div style={{ background: '#FFF7ED', padding: '20px', borderRadius: '14px', border: '1px solid #FFEDD5' }}>
            <h3 style={{ color: '#EA580C', fontSize: '18px', marginBottom: '6px' }}>🍔 Fresh Kitchen</h3>
            <p style={{ fontSize: '14px', color: '#7C2D12' }}>
              Prepared fresh on order with quality ingredients and fast local doorstep delivery.
            </p>
          </div>
          <div style={{ background: '#EFF6FF', padding: '20px', borderRadius: '14px', border: '1px solid #DBEAFE' }}>
            <h3 style={{ color: '#2563EB', fontSize: '18px', marginBottom: '6px' }}>⚡ Verified Electricians</h3>
            <p style={{ fontSize: '14px', color: '#1E3A8A' }}>
              Transparent fixed pricing for fan repair, wiring, switchboard fixes, and home installations.
            </p>
          </div>
          <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '14px', border: '1px solid #DCFCE7' }}>
            <h3 style={{ color: '#16A34A', fontSize: '18px', marginBottom: '6px' }}>📲 Flexible Payments</h3>
            <p style={{ fontSize: '14px', color: '#14532D' }}>
              Pay easily via Cash on Delivery (COD) or instant UPI with UTR reference tracking.
            </p>
          </div>
        </div>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: '#4F46E5',
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '800',
          }}
        >
          Explore Services ➔
        </Link>
      </div>
    </div>
  );
}