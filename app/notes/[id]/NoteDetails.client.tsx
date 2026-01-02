"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data: note, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id as string),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p className={css.loading}>Loading...</p>;
  if (isError) return <p className={css.error}>{(error as Error)?.message || "Error"}</p>;
  if (!note) return <p className={css.empty}>Not found</p>;

  return (
    <div className={css.container}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      <p className={css.meta}>
        {note.tag} • {note.createdAt}
      </p>
    </div>
  );
}