import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diary App",
  description: "하루를 기록하는 나만의 다이어리"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
