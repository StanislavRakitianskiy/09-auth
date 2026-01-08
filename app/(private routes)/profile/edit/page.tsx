"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import css from "./EditProfile.module.css";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

const placeholderAvatar = "https://ac.goit.global/fullstack/react/placeholder-avatar.jpg";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username ?? "");

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    refetchOnMount: true,
    onSuccess: (fetchedUser) => {
      setUser(fetchedUser);
      setUsername(fetchedUser.username);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { username: string }) => updateMe(payload),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      router.push("/profile");
    },
  });

  const displayUser = profile ?? user;
  const avatar = displayUser?.avatar ?? placeholderAvatar;
  const email = displayUser?.email ?? "user_email@example.com";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    updateMutation.mutate({ username: trimmed });
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load profile"} />;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {updateMutation.isError && (
            <p className={css.error}>
              {(updateMutation.error as Error)?.message || "Failed to update profile"}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}