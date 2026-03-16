import api from '../api/axios';

const publicService = {
  /**
   * Fetch marketplace items
   * @param {Object} params Optional query params like { sector, location }
   */
  getMarketplace: async (params = {}) => {
    const response = await api.get('/public/marketplace', { params });
    return response.data;
  },
};

export default publicService;
