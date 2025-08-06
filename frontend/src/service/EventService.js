// services/eventService.js
import axios from "axios";

const BASE_URL = "https://aiesecinruhuna-production.up.railway.app/api/events";

export const deleteEventById = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
