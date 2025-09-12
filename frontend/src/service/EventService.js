// services/eventService.js
import axios from "axios";

const BASE_URL = "https://aiesecruhuna-production.up.railway.app/api/events";

export const deleteEventById = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
