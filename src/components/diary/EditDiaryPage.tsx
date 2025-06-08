"use client";

import DiaryForm from "@/components/diary/DiaryForm";
import { getDiaryById } from "@/libs/diaryApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const EditDiaryPage = () => {
  const { id } = useParams() as { id: string };

  const {
    data: initialData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["diary", id],
    queryFn: () => getDiaryById(id),
    enabled: !!id
  });

  if (isLoading) return <p className="mt-8 text-center">일기 데이터를 불러오고 있어요</p>;
  if (isError || !initialData) return <p className="mt-8 text-center">일기를 찾을 수 없어요</p>;

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <DiaryForm initialData={initialData} isEdit={true} />
    </div>
  );
};

export default EditDiaryPage;
