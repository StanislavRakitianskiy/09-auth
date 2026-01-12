import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import css from "./Profile.module.css";
import { getMe } from "@/lib/api/serverApi";
import type { User } from "@/types/user";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

const PROFILE_URL = `${APP_URL}/profile`;

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View your NoteHub profile details and manage your personal information.",
  alternates: { canonical: PROFILE_URL },
  openGraph: {
    title: "Profile | NoteHub",
    description: "View your NoteHub profile details and manage your personal information.",
    url: PROFILE_URL,
    images: [OG_IMAGE_URL],
    type: "profile",
    siteName: "NoteHub",
  },
};

export default async function ProfilePage() {
  let user: User | null = null;

  try {
    user = await getMe();
  } catch {
    user = null;
  }

  const username = user?.username ?? "your_username";
  const email = user?.email ?? "your_email@example.com";
  const avatar =
    user?.avatar ?? "https://ac.goit.global/fullstack/react/placeholder-avatar.jpg";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton} prefetch={false}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
        </div>
      </div>
    </main>
  );
}