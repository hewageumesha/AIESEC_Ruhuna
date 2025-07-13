
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/events";

export const deleteEventById = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
