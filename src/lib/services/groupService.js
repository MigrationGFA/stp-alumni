import api from '../api/axios';

const groupService = {
  // ─── Groups ────────────────────────────────────────────────────

  getGroups: async () => {
    const response = await api.get('/network/groups');
    return response.data;
  },

  getGroupById: async (groupId) => {
    const response = await api.get(`/network/groups/${groupId}`);
    return response.data;
  },

  createGroup: async (formData) => {
    const response = await api.post('/network/groups', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateGroup: async (groupId, data) => {
    const response = await api.patch(`/network/groups/${groupId}`, data);
    return response.data;
  },

  toggleMembership: async (groupId, action) => {
    const response = await api.post(`/network/groups/${groupId}/member`, { action });
    return response.data;
  },

  getGroupMembers: async (groupId, page = 1, limit = 20) => {
    const response = await api.get(`/network/groups/${groupId}/members`, {
      params: { page, limit },
    });
    return response.data;
  },

  // ─── Posts ─────────────────────────────────────────────────────

  getGroupPosts: async (groupId, page = 1, limit = 20) => {
    const response = await api.get(`/network/groups/${groupId}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },

  createGroupPost: async (groupId, body, images = []) => {
    const formData = new FormData();
    formData.append('body', body);
    images.forEach((file) => formData.append('postImages[]', file));
    const response = await api.post(`/network/groups/${groupId}/posts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  likeGroupPost: async (groupId, postId) => {
    const response = await api.post(`/network/groups/${groupId}/posts/${postId}/like`);
    return response.data;
  },

  getPostComments: async (groupId, postId, page = 1, limit = 20) => {
    const response = await api.get(
      `/network/groups/${groupId}/posts/${postId}/comments`,
      { params: { page, limit } },
    );
    return response.data;
  },

  commentOnPost: async (groupId, postId, comment) => {
    const response = await api.post(
      `/network/groups/${groupId}/posts/${postId}/comment`,
      { comment },
    );
    return response.data;
  },

   reportGroup: async (groupId, reason, description) => {
    const response = await api.post(`/network/groups/${groupId}/reports`, {
      reason,
      description,
    });
    return response.data;
  },

};

export default groupService;