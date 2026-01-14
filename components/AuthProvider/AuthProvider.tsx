"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import Loader from "@/components/Loader/Loader";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    let ignore = false;

    const verifySession = async () => {
      const isPrivate = matchesRoute(pathname, privateRoutes);
      const isAuthPage = matchesRoute(pathname, authRoutes);

      // Якщо це публічна сторінка (не приватна і не auth), не перевіряємо сесію
      if (!isPrivate && !isAuthPage) {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      
      let user: User | null = null;
      try {
        user = await checkSession();
      } catch (error) {
        // Якщо помилка при перевірці сесії, вважаємо користувача неавторизованим
        user = null;
      }

      if (ignore) {
        setIsChecking(false);
        return;
      }

      if (user) {
        setUser(user);
      } else {
        clearIsAuthenticated();
      }

      // Якщо користувач на приватній сторінці і не авторизований - перенаправляємо на логін
      if (isPrivate && !user) {
        clearIsAuthenticated();
        router.replace("/sign-in");
        setIsChecking(false);
        return;
      }

      // Якщо користувач вже авторизований і на сторінці авторизації - перенаправляємо на профіль
      if (isAuthPage && user) {
        router.replace("/profile");
        setIsChecking(false);
        return;
      }

      // Якщо користувач не авторизований і на сторінці авторизації - дозволяємо залишитися
      setIsChecking(false);
    };

    void verifySession();

    return () => {
      ignore = true;
    };
  }, [pathname, router, clearIsAuthenticated, setUser]);

  if (isChecking) {
    return <Loader />;
  }

  return children;
}