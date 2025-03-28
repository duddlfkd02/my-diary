"use client";

import { getDiaryById } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { deleteDiary } from "@/libs/diaryApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

const DiaryDetailPage = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { id } = useParams() as { id: string };
  const router = useRouter();
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

  const handleDelete = async () => {
    if (!user || !diary?.id) return;

    try {
      await deleteDiary(diary.id);
      toast({
        description: "일기가 삭제되었습니다."
      });
      router.push("/diary");
    } catch (error) {
      console.error("삭제 실패", error);
      toast({
        description: "문제가 발생했어요. 다시 시도해주세요."
      });
    }
  };

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
      <div className="mt-2 flex justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/diary/edit/${diary.id}`);
          }}
          className="text-sm text-blue-500 underline"
        >
          ✏️
        </button>
        <DeleteConfirmDialog onConfirm={handleDelete} />
      </div>
    </div>
  );
};

export default DiaryDetailPage;
