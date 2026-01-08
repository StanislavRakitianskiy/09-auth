"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import css from "./SignIn.module.css";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/profile");
    },
    onError: (err: Error) => setError(err.message || "Error"),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    loginMutation.mutate({ email, password });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </div>

        <p className={css.error}>{error || (loginMutation.isError ? (loginMutation.error as Error).message : "")}</p>
      </form>
    </main>
  );
}