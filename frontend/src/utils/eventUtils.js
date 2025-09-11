/**
 * Utility functions for event-related operations
 */

/**
 * Deduplicate merchandise array based on type and description
 * @param {Array} merchandise - Array of merchandise items
 * @returns {Array} - Deduplicated array
 */
export const deduplicateMerchandise = (merchandise) => {
  if (!Array.isArray(merchandise)) return [];
  
  const seen = new Set();
  return merchandise.filter(item => {
    // Create a unique key based on type and description
    const key = `${item.type}-${item.description}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'TBD';
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Format time range for display
 * @param {string} startTime - Start time
 * @param {string} endTime - End time
 * @returns {string} - Formatted time string
 */
export const formatTime = (startTime, endTime) => {
  if (!startTime && !endTime) return 'Time TBD';
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  return startTime || 'Time TBD';
};

/**
 * Check if user is an AIESEC member
 * @param {Object} user - User object
 * @returns {boolean} - Whether user is a member
 */
export const isMember = (user) => {
  return user && ['LCP', 'LCVP', 'Team_Leader', 'Member'].includes(user.role);
};