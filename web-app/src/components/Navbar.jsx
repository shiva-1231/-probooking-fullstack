import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  onOpenCart,
  token,
  username,
  isStaff,
  onOpenAuth,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/food', label: '🍔 Food' },
    { path: '/electrician', label: '⚡ Electrician' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  if (token) {
    navItems.splice(3, 0, { path: '/orders', label: '🛍️ My Orders' });
  }
  if (token && isStaff) {
  navItems.splice(4, 0, { path: '/admin-kitchen', label: '👨‍🍳 Kitchen' });
}

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
          }}
        >
          <div
            style={{
              background: '#4F46E5',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '19px',
            }}
          >
            P
          </div>
          <span style={{ fontSize: '21px', fontWeight: '900', color: '#1E293B', letterSpacing: '-0.5px' }}>
            Pro<span style={{ color: '#4F46E5' }}>Booking</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  background: isActive ? '#EEF2FF' : 'transparent',
                  color: isActive ? '#4F46E5' : '#475569',
                  padding: '7px 12px',
                  borderRadius: '9px',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '14px',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Search Box */}
        <div className="desktop-only" style={{ flex: '1 1 180px', maxWidth: '230px' }}>
          <input
            type="text"
            placeholder="🔍 Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '9px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: '13px',
            }}
          />
        </div>

        {/* Right Actions (Cart + Desktop Auth + Mobile Hamburger) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenCart}
            style={{
              background: cartCount > 0 ? '#4F46E5' : '#F1F5F9',
              color: cartCount > 0 ? '#FFFFFF' : '#1E293B',
              border: 'none',
              padding: '8px 13px',
              borderRadius: '9px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🛒</span>
            <span>{cartCount > 0 ? `${cartCount} • ₹${cartTotal}` : 'Cart'}</span>
          </button>

          {/* Desktop User Auth */}
          <div className="desktop-only" style={{ alignItems: 'center', gap: '8px' }}>
            {token ? (
              <>
                <span
                  style={{
                    background: '#F0FDF4',
                    color: '#15803D',
                    border: '1px solid #BBF7D0',
                    padding: '6px 11px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: '700',
                  }}
                >
                  👤 {username}
                </span>
                <button
                  onClick={onLogout}
                  style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    padding: '7px 11px',
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  background: '#1E293B',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            style={{
              background: '#F1F5F9',
              color: '#0F172A',
              border: 'none',
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-only"
          style={{
            flexDirection: 'column',
            gap: '10px',
            padding: '14px 20px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF',
          }}
        >
          {/* Mobile Search Input */}
          <input
            type="text"
            placeholder="🔍 Search momos, fan repair..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: '14px',
            }}
          />

          {/* Mobile Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    background: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4F46E5' : '#334155',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '15px',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Section */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {token ? (
              <>
                <span style={{ fontWeight: '700', color: '#15803D', fontSize: '14px' }}>
                  👤 Logged in as {username}
                </span>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onLogout();
                  }}
                  style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '9px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenAuth();
                }}
                style={{
                  width: '100%',
                  background: '#1E293B',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}