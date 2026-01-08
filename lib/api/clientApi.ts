import axios, { type AxiosResponse } from "axios";

import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import apiClient from "./api";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
  avatar?: string;
}

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

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string })?.message;
    return message ?? error.message ?? fallback;
  }

  if (error instanceof Error) return error.message;

  return fallback;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response = await apiClient.get<FetchNotesResponse | Note[]>("/notes", {
    params,
  });

  return extractNotesResponse(response);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await apiClient.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await apiClient.post<Note>("/notes", payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await apiClient.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (credentials: AuthCredentials): Promise<User> => {
  try {
    const { data } = await apiClient.post<User>("/auth/register", credentials);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to register"));
  }
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  try {
    const { data } = await apiClient.post<User>("/auth/login", credentials);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to log in"));
  }
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await apiClient.get<User | null>("/auth/session");
    if (!data) return null;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
};

export const updateMe = async (payload: UpdateUserPayload): Promise<User> => {
  try {
    const { data } = await apiClient.patch<User>("/users/me", payload);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update profile"));
  }
};