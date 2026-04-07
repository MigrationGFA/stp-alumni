import api from '../api/axios';

const userService = {
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  updatePreference: async (data) => {
    const response = await api.put('/users/preferences', data);
    return response.data;
  },

  setupProfile: async (formData) => {
    const response = await api.post('/users/profile/setup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    const response = await api.post('/users/profile/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};

export default userService;
