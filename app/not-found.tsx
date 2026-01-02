import type { Metadata } from "next";
import css from "./Home.module.css";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

const title = "NoteHub | Page not found";
const description =
  "The page you are looking for does not exist on NoteHub. Check the URL or return to the notes list.";
const url = `${APP_URL}/not-found`;

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

export default function NotFound() {
  return (
    <main>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}