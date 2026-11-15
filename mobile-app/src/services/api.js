import { BASE_URL } from '../constants/config';

// Central API Request Helper
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
    const errorMessage =
      data.detail ||
      data.error ||
      (typeof data === 'object' ? Object.values(data).flat().join(', ') : null) ||
      'Server request failed';
    throw new Error(errorMessage);
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