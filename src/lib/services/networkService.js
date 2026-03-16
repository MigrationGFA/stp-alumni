import api from '../api/axios';

const networkService = {
  /**
   * Fetch the customized network users lists.
   * Includes `networkUsers`, `sameSkillUsers`, and `sameSectorUsers`.
   * @param {Object} params Optional query params like { search, industry, location }
   */
  getNetwork: async (params = {}) => {
    const response = await api.get('/connections/network', { params });
    return response.data;
  },

  /**
   * Fetch user connections
   */
  getConnections: async () => {
    const response = await api.get('/connections');
    return response.data;
  },

  /**
   * Request connection to a user
   * @param {string} connectedUserId 
   */
  connectToUser: async (connectedUserId) => {
    const response = await api.post('/connections', {
      connectedUserId,
    });
    return response.data;
  },

  /**
   * Accept an incoming connection request
   * @param {string} connectionId 
   */
  acceptConnection: async (connectionId) => {
    const response = await api.post(`/connections/${connectionId}/accept`);
    return response.data;
  },
};

export default networkService;
