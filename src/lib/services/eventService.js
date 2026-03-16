import api from '../api/axios';

const eventService = {
  /**
   * Fetch all events.
   */
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  /**
   * Fetch a single event by ID.
   * @param {string} eventId 
   */
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  /**
   * Create a new event with form data (including cover image)
   * @param {FormData} formData
   */
  createEvent: async (formData) => {
    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default eventService;
