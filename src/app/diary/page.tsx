"use client";
import DiaryList from "@/components/diary/DiaryList";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

const DiaryPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-md items-center justify-center gap-7">
        <Button
          onClick={() => router.push("/diary/write")}
          className="hover:bg-blueDark flex items-center gap-2 rounded-full bg-blueLight px-4 py-2 text-darkText shadow-md transition hover:text-white"
        >
          <Pencil className="h-4 w-4" />
          new
        </Button>
        <ThemeToggle />
      </div>

      <DiaryList />
    </div>
  );
};

export default DiaryPage;
