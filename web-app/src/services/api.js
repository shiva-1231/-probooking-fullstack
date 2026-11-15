import { BASE_URL } from '../config';

async function request(endpoint, { method = 'GET', token = null, body = null } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('webUserToken');
      localStorage.removeItem('webUserName');
    }

    const errorMessage =
      data.detail ||
      data.error ||
      (typeof data === 'object' ? Object.values(data).flat().join(', ') : null) ||
      'Server request failed';

    throw new Error(
      response.status === 401
        ? 'Session expire ho gaya hai—please Logout karke dubara Login karein!'
        : errorMessage
    );
  }

  return data;
}

// --- AUTH APIs ---
export const loginUser = (username, password) =>
  request('/api/token/', {
    method: 'POST',
    body: { username, password },
  });

export const signupUser = (username, password) =>
  request('/api/signup/', {
    method: 'POST',
    body: { username, password },
  });

// --- SERVICES API ---
export const fetchServices = () => request('/api/services/');

// --- ORDERS APIs ---
export const createOrder = (token, orderPayload) =>
  request('/api/orders/create/', {
    method: 'POST',
    token,
    body: orderPayload,
  });

export const fetchMyOrders = (token) =>
  request('/api/orders/', {
    method: 'GET',
    token,
  });

export const cancelOrder = (token, orderId) =>
  request(`/api/orders/${orderId}/cancel/`, {
    method: 'PATCH',
    token,
  });
  // --- USER ROLE & RATING APIs ---
export const fetchCurrentUser = (token) =>
  request('/api/me/', {
    method: 'GET',
    token,
  });

export const rateOrder = (token, orderId, rating, review) =>
  request(`/api/orders/${orderId}/rate/`, {
    method: 'PATCH',
    token,
    body: { rating, review },
  });

// --- STAFF / KITCHEN ADMIN APIs ---
export const fetchStaffOrders = (token) =>
  request('/api/staff/orders/', {
    method: 'GET',
    token,
  });

export const updateStaffOrder = (token, orderId, payload) =>
  request(`/api/staff/orders/${orderId}/update/`, {
    method: 'PATCH',
    token,
    body: payload,
  });

export const toggleServiceStock = (token, serviceId) =>
  request(`/api/staff/services/${serviceId}/toggle-stock/`, {
    method: 'PATCH',
    token,
  });
