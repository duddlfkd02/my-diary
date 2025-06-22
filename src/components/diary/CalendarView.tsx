"use client";

import { toast } from "@/hooks/use-toast";
import useUser from "@/hooks/useUser";
import { getDiariesByMonth, getDiaryByDate, getDiaryStats } from "@/libs/diaryApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const { user } = useUser();
  const guestUserId = process.env.NEXT_PUBLIC_GUEST_USER_ID;

  const isGuest = user?.id === guestUserId;
  const userId = isGuest ? guestUserId : user?.id;

  const router = useRouter();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
  };

  const handleChange = async (value: Date) => {
    if (!userId) return;

    const selected = formatDate(new Date(value));
    try {
      const diary = await getDiaryByDate(userId, selected);

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
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const { data: diaries = [], isLoading } = useQuery({
    queryKey: ["monthly-diaries", userId, year, month],
    queryFn: () => getDiariesByMonth(user!.id, year, month),
    enabled: !!user // user가 있을 때만 실행
  });

  // 감정데이터 map형태로
  const diaryMap = useMemo(() => {
    const mapped: Record<string, string> = {};
    diaries?.forEach((entry) => {
      mapped[formatDate(new Date(entry.date))] = entry.mood;
    });
    return mapped;
  }, [diaries]);

  const { data: stats = { total: 0, monthly: 0, streak: 0 } } = useQuery({
    queryKey: ["diary-stats", userId],
    queryFn: () => getDiaryStats(user!.id),
    enabled: !!user
  });

  return (
    <div className="mx-auto flex max-w-[350px] flex-col">
      <Calendar
        locale="ko"
        onClickDay={handleChange}
        value={selectedDate}
        calendarType="gregory"
        formatDay={(locale, date) => date.getDate().toString()}
        className="w-full rounded-lg border shadow-md"
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setViewDate(activeStartDate);
        }}
        tileContent={({ date }) => {
          const key = formatDate(date);
          const mood = diaryMap[key];

          return mood ? <img src={`/mood/${mood}.png`} alt={mood} className="mx-auto mt-1 h-4 w-4" /> : null;
        }}
      />
      <div className="mt-4 rounded-lg bg-blueLight p-4 text-center shadow">
        <div className="flex justify-around text-sm font-medium text-gray-700">
          <div>
            <p className="text-blue-500 text-xl font-bold">{stats.total}</p>
            <p>총 일기</p>
          </div>
          <div>
            <p className="text-xl font-bold text-indigo-500">{stats.monthly}</p>
            <p>이번 달</p>
          </div>
          <div>
            <p className="text-xl font-bold text-red-400">{stats.streak}</p>
            <p>연속 일기</p>
          </div>
        </div>
      </div>
    </div>
  );
}
