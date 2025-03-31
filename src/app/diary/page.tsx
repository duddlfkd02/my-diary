"use client";
import DiaryList from "@/components/DiaryList";
import ThemeToggle from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

const DiaryPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <button onClick={() => router.push("/diary/write")}>✏️일기쓰기</button>

      <DiaryList />
      <ThemeToggle />
    </div>
  );
};

export default DiaryPage;
