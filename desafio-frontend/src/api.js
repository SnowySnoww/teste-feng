const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  ORDERS: `${API_BASE_URL}/orders`,
  ITEMS: `${API_BASE_URL}/items`,
};
