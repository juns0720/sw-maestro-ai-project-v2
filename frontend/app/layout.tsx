import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewPick",
  description: "AI 기반 뉴스 큐레이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
