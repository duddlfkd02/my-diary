"use client";

import { getDiaryById } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { deleteDiary } from "@/libs/diaryApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-darkText">당신의 마음을 되돌아보세요</h1>
      </div>

      <div className="w-full max-w-sm rounded-xl bg-ivory p-6 shadow-lg">
        {/* 일기 내용 */}
        <div className="mb-8 min-h-[300px]">
          <p className="whitespace-pre-wrap text-sm text-darkText">{diary.content}</p>
        </div>

        {/* 날짜 + 감정/날씨 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>{diary.date}</p>
          <div className="flex items-center gap-2">
            {diary.mood && <img src={`/mood/${diary.mood}.png`} alt="mood" className="h-6 w-6" />}
            {diary.weather && <img src={`/weather/${diary.weather}.png`} alt="weather" className="h-6 w-6" />}
          </div>
        </div>
      </div>
      {/* 수정 / 삭제 아이콘 */}
      <div className="mt-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.push(`/diary/edit/${diary.id}`)}
          className="rounded-full hover:bg-[#728FDF]"
        >
          <Pencil className="text-ivory" />
        </Button>
        <DeleteConfirmDialog onConfirm={handleDelete}>
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-[#728FDF]">
            <Trash2 className="text-red-500" />
          </Button>
        </DeleteConfirmDialog>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
