const API_BASE_URL = 'https://tugas-aplikasi-kajian-lingkungan-hi.vercel.app/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada permintaan server.');
  }
  return data;
};

// API Services
export const authService = {
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => apiFetch('/auth/profile', { method: 'GET' })
};

export const bankSampahService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/bank-sampah${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/bank-sampah/${id}`),
  create: (data) => apiFetch('/bank-sampah', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/bank-sampah/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/bank-sampah/${id}`, { method: 'DELETE' })
};

export const jenisSampahService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/jenis-sampah${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/jenis-sampah/${id}`),
  create: (data) => apiFetch('/jenis-sampah', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/jenis-sampah/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/jenis-sampah/${id}`, { method: 'DELETE' })
};

export const kategoriSampahService = {
  getAll: () => apiFetch('/kategori-sampah'),
  create: (data) => apiFetch('/kategori-sampah', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/kategori-sampah/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/kategori-sampah/${id}`, { method: 'DELETE' })
};

export const transaksiService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/transaksi${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/transaksi/${id}`),
  create: (data) => apiFetch('/transaksi', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, statusData) => apiFetch(`/transaksi/${id}`, { method: 'PUT', body: JSON.stringify(statusData) }),
  delete: (id) => apiFetch(`/transaksi/${id}`, { method: 'DELETE' })
};

export const dashboardService = {
  getAdmin: () => apiFetch('/dashboard/admin'),
  getPengelola: () => apiFetch('/dashboard/pengelola'),
  getMasyarakat: () => apiFetch('/dashboard/masyarakat')
};

export const edukasiService = {
  getAll: () => apiFetch('/edukasi'),
  getById: (id) => apiFetch(`/edukasi/${id}`),
  create: (data) => apiFetch('/edukasi', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/edukasi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/edukasi/${id}`, { method: 'DELETE' })
};

export const userService = {
  getAll: () => apiFetch('/users'),
  getById: (id) => apiFetch(`/users/${id}`),
  update: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/users/${id}`, { method: 'DELETE' })
};
