import api from '../api/axios';

const resourceService = {
  /**
   * Upload a new resource
   * @param {FormData} formData - including title, description, category, resourceFile
   */
  uploadResource: async (formData) => {
    const response = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetch resources
   * @param {Object} params Optional query params like { category, search, fileType, sortBy }
   */
  getResources: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  /**
   * Download a resource
   * @param {string} resourceId
   * @param {FormData} formData (optional)
   */
  downloadResource: async (resourceId, formData) => {
    const config = formData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    const response = await api.post(`/resources/download/${resourceId}`, formData, config);
    return response.data;
  },
};

export default resourceService;
