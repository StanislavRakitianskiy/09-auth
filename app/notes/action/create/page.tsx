import type { Metadata } from "next";

import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

const title = "Create a new note | NoteHub";
const description =
  "Start a new NoteHub note, save your draft automatically, and keep your ideas organized.";
const url = `${APP_URL}/notes/action/create`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    images: [OG_IMAGE_URL],
    type: "website",
    siteName: "NoteHub",
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}