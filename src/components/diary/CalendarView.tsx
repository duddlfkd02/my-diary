"use client";

import useUser from "@/hooks/useUser";
import { getDiariesByMonth } from "@/libs/diaryApi";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryMap, setDiaryMap] = useState<Record<string, string>>({});
  const [viewDate, setViewDate] = useState(new Date());

  const { user } = useUser();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
  };

  const handleChange = (value: Date) => {
    setSelectedDate(value);
    console.log("선택한 날짜", formatDate(value));
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
