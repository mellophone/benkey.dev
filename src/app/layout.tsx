import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ["100", "300", "400", "500", "600"],
  variable: "--font-kanit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ben Key",
  description: "Welcome to my website!",
  icons: {
    icon: "/ben-head-outline.png",
    apple: "/ben-head-outline.png",
  },
  openGraph: {
    title: "Ben Key",
    description: "Welcome to my website!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable}`}>{children}</body>
    </html>
  );
}
