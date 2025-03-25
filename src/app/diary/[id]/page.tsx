"use client";

import { getDiaryById } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const DiaryDetailPage = () => {
  const { id } = useParams() as { id: string };
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiaryById(id);
        setDiary(data);
      } catch (error) {
        console.error("일기 불러오기를 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiary();
  }, [id]);

  if (loading) return <p className="mt-8 text-center">일기 데이터를 불러오고 있어요</p>;
  if (!diary) return <p className="mt-8 text-center">일기를 찾을 수 없어요</p>;
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-lg border p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{diary.date}</span>
        <div className="flex gap-2">
          {diary.mood && <img src={`/mood/${diary.mood}.png`} alt="mood" className="h-6 w-6" />}
          {diary.weather && <img src={`/weather/${diary.weather}.png`} alt="weather" className="h-6 w-6" />}
        </div>
      </div>
      <p className="whitespace-pre-wrap">{diary.content}</p>
    </div>
  );
};

export default DiaryDetailPage;
