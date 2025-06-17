"use client";
import CalendarView from "@/components/diary/CalendarView";
import MenuBar from "@/components/MenuBar";

const DiaryPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <CalendarView />
      <MenuBar />
    </div>
  );
};

export default DiaryPage;
