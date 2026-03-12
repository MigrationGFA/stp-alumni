import api from '../api/axios';

const groupService = {
  /**
   * Fetch all groups.
   * Includes `isMember` boolean to indicate if the current user is a member.
   */
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  /**
   * Toggle membership for a group (action: "JOIN" or "LEAVE")
   * @param {string} groupId 
   * @param {string} action 
   */
  toggleMembership: async (groupId, action) => {
    const response = await api.post(`/groups/${groupId}/member`, {
      action,
    });
    return response.data;
  },

  /**
   * Create a new group
   * @param {FormData} formData - including name, description, and thumbnail
   */
  createGroup: async (formData) => {
    const response = await api.post('/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Manage a group member (action: "ADD" or "REMOVE")
   * @param {string} groupId 
   * @param {string} userId
   * @param {string} action 
   */
  manageMembers: async (groupId, userId, action) => {
    const response = await api.post(`/groups/${groupId}/manage-members`, {
      userId,
      action,
    });
    return response.data;
  },

  /**
   * Get member status for a specific group
   * @param {string} groupId 
   */
  getMemberStatus: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/member`);
    return response.data;
  },
};

export default groupService;
