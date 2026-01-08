"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import css from "./AuthNavigation.module.css";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated || user) return;

    checkSession()
      .then((sessionUser) => {
        if (sessionUser) {
          setUser(sessionUser);
        }
      })
      .catch(() => undefined);
  }, [isAuthenticated, setUser, user]);

  const handleLogout = async () => {
    await logout().catch(() => undefined);
    clearIsAuthenticated();
    router.push("/sign-in");
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>
          <button type="button" className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}