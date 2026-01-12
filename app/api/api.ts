import axios from "axios";

export const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});

export const logErrorResponse = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data ?? error.message);
    return;
      }

  console.error(error);
};