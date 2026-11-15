import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert('Saare fields bharein!');
      return;
    }
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
          📞 Contact & Support
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '24px' }}>
          Kisi order, bulk party catering, ya urgent electrician booking ke liye humein message bhejein.
        </p>

        {submitted ? (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '24px', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '36px', marginBottom: '8px' }}>✅</p>
            <h3 style={{ color: '#166534', marginBottom: '6px' }}>Message Received!</h3>
            <p style={{ color: '#15803D', fontSize: '14px', marginBottom: '16px' }}>
              Hamari team jald hi aapke mobile number par sampark karegi.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              style={{
                background: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Your Name *</label>
              <input
                type="text"
                placeholder="Apna naam likhein"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Mobile Number *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Message / Query *</label>
              <textarea
                rows="4"
                placeholder="Apna sawal ya bulk order details likhein..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '13px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Send Message ➔
            </button>
          </form>
        )}
      </div>
    </div>
  );
}