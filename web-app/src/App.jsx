import { fetchServices, fetchCurrentUser } from './services/api';
import AdminKitchenPage from './pages/AdminKitchenPage';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import MyOrdersView from './components/MyOrdersView';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function CatalogSection({ services, categoryFilter, searchQuery, loading, error, getItemQuantity, addToCart, removeFromCart }) {
  const navigate = useNavigate();

  const filteredServices = services.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {categoryFilter === 'ALL' && !searchQuery && (
        <div className="hero-banner"
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            borderRadius: '20px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)',
          }}
        >
          <div>
            <h1 className="hero-title" style={{ fontWeight: '900', marginBottom: '8px' }}>
              Fresh Food & Trusted Electricians, Delivered Fast 🚀
            </h1>
            <p style={{ color: '#E0E7FF', fontSize: '16px', maxWidth: '600px' }}>
              Order hot momos, rolls, samosas, sweets & burgers or book verified home electrician services in one click.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/food')}
              style={{
                background: '#FFFFFF',
                color: '#4F46E5',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              🍔 Explore Food
            </button>
            <button
              onClick={() => navigate('/electrician')}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              ⚡ Book Electrician
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>
          {categoryFilter === 'FOOD'
            ? '🍔 Hotel & Restaurant Menu'
            : categoryFilter === 'ELEC'
              ? '⚡ Electrician Services'
              : '✨ All Available Services'}
        </h2>
        <span style={{ color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
          {filteredServices.length} {filteredServices.length === 1 ? 'item' : 'items'} found
        </span>
      </div>

      {loading && <p>Loading services from server...</p>}
      {error && <p style={{ color: '#DC2626' }}>Error: {error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {filteredServices.map((item) => {
          const qty = getItemQuantity(item.id);
          return (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '100%', height: '175px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '175px',
                    background: item.category === 'FOOD' ? '#FFF7ED' : '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                  }}
                >
                  {item.category === 'FOOD' ? '🍔' : '⚡'}
                </div>
              )}

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      letterSpacing: '0.5px',
                      color: item.category === 'FOOD' ? '#EA580C' : '#2563EB',
                    }}
                  >
                    {item.category === 'FOOD' ? '🍔 HOTEL & FOOD' : '⚡ ELECTRICIAN'}
                  </span>
                  <h3 style={{ margin: '6px 0', fontSize: '18px', color: '#0F172A' }}>{item.name}</h3>
                  <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
                    {item.description || 'Quality service at your doorstep'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <strong style={{ fontSize: '19px', color: '#0F172A' }}>₹{item.price}</strong>

                  {item.is_available === false ? (
                    <span
                      style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '800',
                      }}
                    >
                      Out of Stock
                    </span>
                  ) : qty === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        background: '#4F46E5',
                        color: 'white',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}
                    >
                      + Add
                    </button>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#EEF2FF',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        border: '1px solid #C7D2FE',
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: '#4F46E5',
                          color: 'white',
                          border: 'none',
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: '800', color: '#4F46E5', minWidth: '16px', textAlign: 'center' }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: '#4F46E5',
                          color: 'white',
                          border: 'none',
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [token, setToken] = useState(() => localStorage.getItem('webUserToken'));
  const [username, setUsername] = useState(() => localStorage.getItem('webUserName') || '');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [cart, setCart] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!token) {
      setIsStaff(false);
      return;
    }
    fetchCurrentUser(token)
      .then((info) => setIsStaff(Boolean(info.is_staff)))
      .catch(() => setIsStaff(false));
  }, [token]);

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

  const getItemQuantity = (id) => {
    const found = cart.find((item) => item.id === id);
    return found ? found.quantity : 0;
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
    setShowCartDrawer(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('webUserToken');
    localStorage.removeItem('webUserName');
    setToken(null);
    setUsername('');
    navigate('/');
  };

  const catalogProps = {
    services,
    searchQuery,
    loading,
    error,
    getItemQuantity,
    addToCart,
    removeFromCart,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setShowCartDrawer(true)}
        token={token}
        username={username}
        isStaff={isStaff}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

          
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '30px 24px' }}>
        <Routes>
          <Route
            path="/admin-kitchen"
            element={
              token && isStaff ? (
                <AdminKitchenPage token={token} services={services} onRefreshServices={loadData} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="/" element={<CatalogSection {...catalogProps} categoryFilter="ALL" />} />
          <Route path="/food" element={<CatalogSection {...catalogProps} categoryFilter="FOOD" />} />
          <Route path="/electrician" element={<CatalogSection {...catalogProps} categoryFilter="ELEC" />} />
          <Route
            path="/orders"
            element={token ? <MyOrdersView token={token} onReorder={handleReorder} /> : <Navigate to="/" />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(newToken, newUser) => {
          setToken(newToken);
          setUsername(newUser);
        }}
      />

      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        cart={cart}
        cartTotal={cartTotal}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onClearCart={() => setCart([])}
        token={token}
        onRequireLogin={() => setShowAuthModal(true)}
        onOrderSuccess={() => navigate('/orders')}
      />
    </div>
  );
}

export default App;