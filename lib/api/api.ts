import axios from "axios";

const resolvedBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
};

const appBaseUrl = resolvedBaseUrl();

const apiBase = `${appBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

export default apiClient;