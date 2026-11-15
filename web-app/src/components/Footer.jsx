import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0F172A',
        color: '#CBD5E1',
        marginTop: '60px',
        padding: '44px 24px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid #1E293B',
        }}
      >
        {/* Brand Info */}
        <div>
          <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '900', marginBottom: '10px' }}>
            Pro<span style={{ color: '#818CF8' }}>Booking</span>
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#94A3B8' }}>
            Freshly prepared hotel snacks, sweets & meals along with verified doorstep electrician services—fast, reliable, and affordable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
            <Link to="/food" style={{ color: '#94A3B8', textDecoration: 'none' }}>Hotel & Food Menu</Link>
            <Link to="/electrician" style={{ color: '#94A3B8', textDecoration: 'none' }}>Electrician Services</Link>
            <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About Us</Link>
            <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Contact Support</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>
            Customer Support
          </h4>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '6px' }}>📍 Serving Local City & Nearby Areas</p>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '6px' }}>⏰ Open Daily: 8:00 AM – 10:30 PM</p>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>💳 Cash on Delivery & Direct UPI Accepted</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748B' }}>
        © {new Date().getFullYear()} ProBooking Services. All rights reserved.
      </div>
    </footer>
  );
}