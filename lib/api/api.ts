import axios from "axios";

const appBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`.replace(/\/$/, "")
    : "http://localhost:3000");

const apiBase = `${appBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

export default apiClient;