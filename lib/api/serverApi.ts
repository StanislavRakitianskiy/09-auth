import axios, { type AxiosResponse } from "axios";
import { cookies } from "next/headers";

import apiClient from "./api";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";
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

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await apiClient.get<FetchNotesResponse | Note[]>("/notes", {
    params,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return extractNotesResponse(response);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { data } = await apiClient.get<Note>(`/notes/${id}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { data } = await apiClient.get<User>("/users/me", {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    return await apiClient.get<User | null>("/auth/session", {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response as AxiosResponse<User | null>;
    }

    throw error;
  }
};