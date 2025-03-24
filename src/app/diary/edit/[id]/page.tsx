"use client";

import DiaryForm from "@/components/DiaryForm";
import { getDiaryById } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EditDiaryPage = () => {
  const { id } = useParams() as { id: string };
  const [initialData, setInitialData] = useState<Diary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiaryById(id);
        setInitialData(data);
      } catch (error) {
        console.error("다이어리 불러오기 실패", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDiary();
  }, [id]);

  if (loading) return <p className="mt-8 text-center">일기 데이터를 불러오고 있어요</p>;
  if (!initialData) return <p className="mt-8 text-center">일기를 찾을 수 없어요</p>;

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <DiaryForm initialData={initialData} isEdit={true} />
    </div>
  );
};

export default EditDiaryPage;
