import type { Metadata } from "next";
import { Handlee } from "next/font/google";
import "./globals.css";

const handlee = Handlee({
  variable: "--font-handlee",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ben Key",
  description: "Welcome to my website!",
  openGraph: {
    type: "website",
    url: "https://dev.benkey.dev",
    title: "Ben Key",
    description: "Welcome to my website!",
    siteName: "benkey.dev",
    images: [{ url: "https://dev.benkey.dev/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${handlee.variable}`}>{children}</body>
    </html>
  );
}
