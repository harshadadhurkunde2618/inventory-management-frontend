import api from './axios';

export const getMovements = () => api.get('/movements');
export const getProductMovements = (productId) => api.get(`/movements/product/${productId}`);
export const createMovement = (data) => api.post('/movements', data);