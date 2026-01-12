import axios, { type AxiosResponse } from "axios";

import apiClient from "./api";
import type {
  FetchNotesParams,
  FetchNotesResponse,
} from "./clientApi";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const extractNotesResponse = (
  response: AxiosResponse<FetchNotesResponse | Note[]>
): FetchNotesResponse => {
  const { data, headers } = response;

  if (Array.isArray(data)) {
    const pagesHeader = headers["x-total-pages"] ?? headers["x-total-count"];
    const totalPages =
      typeof pagesHeader === "string" ? Number(pagesHeader) || 1 : 1;

    return { notes: data, totalPages };
  }

  return data;
};

const withCookies = (cookieHeader?: string) =>
  cookieHeader ? { Cookie: cookieHeader } : undefined;

export const fetchNotes = async (
  params: FetchNotesParams,
  cookieHeader?: string
): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse | Note[]>("/notes", {
    params,
    headers: withCookies(cookieHeader),
  });

  return extractNotesResponse(response);
};

export const fetchNoteById = async (
  id: string,
  cookieHeader?: string
): Promise<Note> => {
  const { data } = await apiClient.get<Note>(`/notes/${id}`, {
    headers: withCookies(cookieHeader),
  });
  return data;
};

export const getMe = async (cookieHeader?: string): Promise<User> => {
  const { data } = await apiClient.get<User>("/users/me", {
    headers: withCookies(cookieHeader),
  });
  return data;
};

export const checkSession = async (
  cookieHeader?: string
): Promise<AxiosResponse<User | null>> => {
  try {
    return await apiClient.get<User | null>("/auth/session", {
      headers: withCookies(cookieHeader),
    });
  } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
      return error.response as AxiosResponse<User | null>;
    }

    throw error;
  }
};