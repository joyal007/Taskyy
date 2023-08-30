import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasky",
  description: "Manage your tasks with easy drag and drop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link
        rel="icon"
        href="./icon.svg"
        type="image/svg"
        sizes="24x24"
      />
      </head>
      <body>     
        <div className="flex flex-col h-screen">
        {children}
        </div>
      </body>
    </html>
  );
}
