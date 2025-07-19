import axios from 'axios';
const apiService = {
  // Get all events for analytics
  getEvents: async () => {
    const response = await axios.get('/analytics/registrations/events');
    if (response.status !== 200) throw new Error('Failed to fetch events');
    return response.data;
  },

  // Get registration analytics by event
  getRegistrationsByEvent: async (eventId = null, status = null) => {
    const params = new URLSearchParams();
    if (eventId) params.append('eventId', eventId);
    if (status) params.append('status', status);
    
    const response = await fetch(`/analytics/registrations/by-event?${params}`);
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  },

  // Updated to fetch member registrations with user details
  getMemberRegistrations: async (eventId, page = 0, size = 10) => {
    const response = await fetch(`api/member-event-registrations/event/${eventId}/paged?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch member registrations');
    const data = await response.json();
    
    // Transform the data to include proper user information
    if (data.content) {
      data.content = data.content.map(registration => ({
        ...registration,
        // Construct full name from user data
        name: registration.user ? 
          `${registration.user.firstName || ''} ${registration.user.lastName || ''}`.trim() : 
          'Unknown Member',
        // Use user email
        email: registration.user?.email || registration.user?.aiesecEmail || 'No email',
        // Use user phone
        contact: registration.user?.phone || 'No contact',
        // Map status correctly
        status: registration.interestStatus || 'PENDING'
      }));
    }
    
    return data;
  },

  // Updated to fetch guest registrations with proper contact info
  getGuestRegistrations: async (eventId, page = 0, size = 10) => {
    const response = await fetch(`api/guest-registrations/event/${eventId}/paged?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch guest registrations');
    const data = await response.json();
    
    // Transform the data to ensure proper mapping
    if (data.content) {
      data.content = data.content.map(registration => ({
        ...registration,
        // Guest name should be directly from registration
        name: registration.name || 'Unknown Guest',
        // Guest email from registration
        email: registration.email || 'No email',
        // Guest phone from registration
        contact: registration.phone || 'No contact',
        // Map status correctly
        status: registration.interestStatus || 'PENDING'
      }));
    }
    
    return data;
  },

  // Get status distribution for an event (include all statuses)
  getStatusDistribution: async (eventId, type = 'all') => {
    const params = new URLSearchParams({
      eventId: eventId.toString(),
      type
    });
    
    const response = await fetch(`/analytics/registrations/status-distribution?${params}`);
    if (!response.ok) throw new Error('Failed to fetch status distribution');
    return response.json();
  },

  // Get member status summary (all statuses)
  getMemberStatusSummary: async (eventId) => {
    const response = await fetch(`api/member-event-registrations/event/${eventId}/status-summary`);
    if (!response.ok) throw new Error('Failed to fetch member status summary');
    const data = await response.json();
    
    // Ensure all statuses are included
    return {
      GOING: data.GOING || 0,
      PENDING: data.PENDING || 0,
      NOT_GOING: data.NOT_GOING || 0
    };
  },

  // Get guest status summary (all statuses)
  getGuestStatusSummary: async (eventId) => {
    const response = await fetch(`api/guest-registrations/event/${eventId}/status-summary`);
    if (!response.ok) throw new Error('Failed to fetch guest status summary');
    const data = await response.json();
    
    // Ensure all statuses are included
    return {
      GOING: data.GOING || 0,
      PENDING: data.PENDING || 0,
      NOT_GOING: data.NOT_GOING || 0
    };
  }
};

export default apiService;