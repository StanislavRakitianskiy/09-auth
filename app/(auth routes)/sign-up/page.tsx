"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import css from "./SignUp.module.css";
import { register, checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (user) => {
      // Встановлюємо користувача з відповіді реєстрації
      setUser(user);
      
      // Перевіряємо сесію, щоб переконатися, що cookies встановлені
      try {
        const sessionUser = await checkSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        // Якщо помилка, все одно переходимо на профіль, оскільки реєстрація успішна
        console.error("Session check failed after registration:", error);
      }
      
      router.push("/profile");
    },
    onError: (error: Error) => setErrorMessage(error.message || "Error"),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(""); // Очищаємо попередні помилки
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    registerMutation.mutate({ email, password });
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
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
          <button type="submit" className={css.submitButton} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>

        <p className={css.error}>
          {errorMessage || (registerMutation.isError ? (registerMutation.error as Error).message : "")}
        </p>
      </form>
    </main>
  );
}