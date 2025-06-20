"use client";

import useUser from "@/hooks/useUser";
import { getMoodStats } from "@/libs/diaryApi";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const MoodChart = dynamic(() => import("@/components/statistics/MoodChart"), {
  ssr: false
});

export default function StatisticsPage() {
  const { user } = useUser();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ["moodStats", user?.id, year, month],
    queryFn: () => getMoodStats(user!.id, year, month),
    enabled: !!user
  });

  if (isLoading) return <p>감정 데이터 로딩 중...</p>;
  if (error) {
    console.log(error.message);
    return <p>감정 데이터 로딩 중 오류 발생</p>;
  }

  return (
    <div className="flex min-h-screen flex-col p-6">
      <MoodChart data={data ?? []} />
    </div>
  );
}
