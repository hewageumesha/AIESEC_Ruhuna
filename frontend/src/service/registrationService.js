import axios from 'axios';

export const registerMember = async (data) => {
  try {
    await axios.post('/api/member-registration', data);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};

export const registerGuest = async (data) => {
  try {
    await axios.post('/api/guest-registration', data);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
