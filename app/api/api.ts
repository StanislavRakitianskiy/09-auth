import axios from "axios";

const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});

export default api;