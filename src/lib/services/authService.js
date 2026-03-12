import api from '../api/axios';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    // Assuming register also uses Basic Auth or is a public endpoint without Bearer
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    // This will use the default Axios interceptor which attaches the Bearer token
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
