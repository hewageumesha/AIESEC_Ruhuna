// services/eventService.js
import axios from "axios";

const BASE_URL = "https://aiesec-ruhuna.vercel.app/api/events";

export const deleteEventById = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
