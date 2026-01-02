import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const url = `${APP_URL}/notes/${id}`;

  try {
    const note = await fetchNoteById(id);
    const description =
      note.content?.trim().slice(0, 150) ||
      `Read the ${note.tag} note "${note.title}" on NoteHub.`;
    const title = `${note.title} | NoteHub`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        images: [OG_IMAGE_URL],
        type: "article",
        siteName: "NoteHub",
      },
    };
  } catch {
    const fallbackTitle = "Note details | NoteHub";
    const fallbackDescription =
      "View the details of this note on NoteHub, including content and tags.";

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical: url },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url,
        images: [OG_IMAGE_URL],
        type: "article",
        siteName: "NoteHub",
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
