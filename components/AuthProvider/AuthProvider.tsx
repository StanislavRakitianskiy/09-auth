"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import Loader from "@/components/Loader/Loader";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

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
      setIsChecking(true);
      const user = await checkSession();

      if (ignore) return;

      if (user) {
        setUser(user);
      } else {
        clearIsAuthenticated();
      }

      const isPrivate = matchesRoute(pathname, privateRoutes);
      const isAuthPage = matchesRoute(pathname, authRoutes);

      if (isPrivate && !user) {
        await logout().catch(() => undefined);
        clearIsAuthenticated();
        router.replace("/sign-in");
        setIsChecking(false);
        return;
      }

      if (isAuthPage && user) {
        router.replace("/profile");
        setIsChecking(false);
        return;
      }

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