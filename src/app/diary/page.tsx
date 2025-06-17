"use client";
import CalendarView from "@/components/diary/CalendarView";
import DiaryList from "@/components/diary/DiaryList";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChartNetwork, Pencil } from "lucide-react";
import Link from "next/link";

const DiaryPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <CalendarView />

      <div className="flex w-full max-w-md items-center justify-center gap-7">
        <Button
          asChild
          className="hover:bg-blueDark flex items-center gap-2 rounded-full bg-blueLight px-4 py-2 text-darkText shadow-md transition hover:text-white"
        >
          <Link href="/diary/write">
            <Pencil className="h-4 w-4" />
            new
          </Link>
        </Button>
        <Button
          asChild
          className="hover:bg-blueDark flex items-center gap-2 rounded-full bg-blueLight px-4 py-2 text-darkText shadow-md transition hover:text-white"
        >
          <Link href="/diary/statistics">
            <ChartNetwork />
            감정 통계
          </Link>
        </Button>

        {/* <ThemeToggle /> */}
      </div>
    </div>
  );
};

export default DiaryPage;
