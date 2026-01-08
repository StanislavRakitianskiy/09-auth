import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { NoteTag } from "@/types/note";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

const NOTES_PER_PAGE = 12;

type PageProps = {
  params: { slug: string[] };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const selected = slug?.[0] ?? "all";
  const label = selected === "all" ? "All" : selected;
  const pageTitle = `${label} notes | NoteHub`;
  const description = `Browse ${label.toLowerCase()} notes on NoteHub with filters and search.`;
  const url = `${APP_URL}/notes/filter/${encodeURIComponent(selected)}`;

  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      images: [OG_IMAGE_URL],
      type: "website",
      siteName: "NoteHub",
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = params;
  const selected = slug?.[0] ?? "all";
  const cookieHeader = cookies().toString();

  const tagParam = selected === "all" ? undefined : (selected as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tagParam ?? "all"],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: NOTES_PER_PAGE,
        tag: tagParam,
      }, cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tagParam} />
    </HydrationBoundary>
  );
}