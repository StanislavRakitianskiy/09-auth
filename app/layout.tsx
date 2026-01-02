import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { APP_URL, OG_IMAGE_URL } from "@/lib/seo";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const appTitle = "NoteHub | Your modern note keeper";
const appDescription =
  "NoteHub is a clean and efficient application for creating, browsing, and organizing personal notes.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: appTitle,
  description: appDescription,
  openGraph: {
    title: appTitle,
    description: appDescription,
    url: APP_URL,
    images: [OG_IMAGE_URL],
    type: "website",
    siteName: "NoteHub",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}