"use client";

import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/useUser";
import { getDiariesByMonth, getDiaryByDate } from "@/libs/diaryApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryMap, setDiaryMap] = useState<Record<string, string>>({});
  const [viewDate, setViewDate] = useState(new Date());

  const { user } = useUser();
  const router = useRouter();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
  };

  const handleChange = async (value: Date) => {
    if (!user) return;

    const selected = formatDate(new Date(value));
    try {
      const diary = await getDiaryByDate(user.id, selected);

      if (diary) {
        router.push(`/diary/${diary.id}`);
      } else {
        toast({
          title: "아직 일기를 작성하지 않았어요."
        });
      }
    } catch (error) {
      console.log("일기 데이터 조회 실패", error);
      toast({
        title: "문제가 발생했어요",
        description: "잠시 후 다시 시도해 주세요.",
        variant: "destructive"
      });
    }

    setSelectedDate(value);
  };

  // 월별 감정 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchMonthlyDiaries = async () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();

      const data = await getDiariesByMonth(user.id, year, month);
      const mapped: Record<string, string> = {};
      data.forEach((entry) => {
        mapped[formatDate(new Date(entry.date))] = entry.mood;
      });

      setDiaryMap(mapped);
    };

    fetchMonthlyDiaries();
  }, [user, viewDate]);

  return (
    <div className="flex flex-col items-center">
      <Calendar
        locale="ko"
        onClickDay={handleChange}
        value={selectedDate}
        calendarType="gregory"
        formatDay={(locale, date) => date.getDate().toString()}
        className="rounded-lg border p-2 shadow-md"
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setViewDate(activeStartDate);
        }}
        tileContent={({ date }) => {
          const key = formatDate(date);
          const mood = diaryMap[key];

          return mood ? <img src={`/mood/${mood}.png`} alt={mood} className="mx-auto mt-1 h-4 w-4" /> : null;
        }}
      />
    </div>
  );
}
