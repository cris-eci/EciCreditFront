import axios from 'axios';

const API_URL = 'https://dragon-ete4agc5byajakbd.canadacentral-01.azurewebsites.net/api/bills';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getBillsByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bills');
  }
};

export const createBill = async (billData) => {
  try {
    const response = await api.post('', billData);
    return response.data;
  } catch (error) {
    // If the server returns error data, return it so the frontend can display it
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.message || 'Failed to create bill');
  }
};