"use client";

import { getDiaryById } from "@/libs/diaryApi";
import { deleteDiary } from "@/libs/diaryApi";
import { useParams, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DiaryDetailPage = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: diary, isLoading } = useQuery({
    queryKey: ["diary", id],
    queryFn: () => getDiaryById(id),
    enabled: !!id
  });

  const { mutate: deleteDiaryMutate, isPending } = useMutation({
    mutationFn: deleteDiary,
    onSuccess: () => {
      toast({
        description: "일기가 삭제되었습니다."
      });
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      router.push("/diary");
    },
    onError: () => {
      toast({
        description: "문제가 발생했어요. 다시 시도해주세요."
      });
    }
  });

  const handleDelete = async () => {
    if (!user || !diary?.id) return;
    deleteDiaryMutate(diary.id);
  };

  if (isLoading) return <p className="mt-8 text-center">일기 데이터를 불러오고 있어요</p>;
  if (!diary) return <p className="mt-8 text-center">일기를 찾을 수 없어요</p>;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  };
  if (!diary.date) return <p>날짜 정보가 없습니다.</p>;

  const formattedDate = new Date(diary.date).toLocaleDateString("ko-KR", options);

  const firstSentenceEnd = diary.content.indexOf(".") + 1 || diary.content.length;
  const firstSentence = diary.content.slice(0, firstSentenceEnd).trim();
  const restContent = diary.content.slice(firstSentenceEnd).trim();

  return (
    <div className="bg-light min-h-screen p-4">
      <div className="flex items-center justify-between rounded-t-xl bg-[#EFF3FF] px-4 py-3">
        <div className="flex-1 text-center font-bold text-darkText">{formattedDate}</div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6">
          <div className="mb-2 text-lg font-bold text-darkText">{firstSentence}</div>
          {restContent && <p className="whitespace-pre-wrap text-gray-500">{restContent}</p>}
        </div>

        <div className="mb-6 flex justify-between text-sm text-gray-700">
          <div className="flex flex-col items-center">
            <span className="mb-1 font-semibold">기분</span>
            {diary.mood ? (
              <>
                <img src={`/mood/${diary.mood}.png`} alt="mood" className="mb-1 h-6 w-6" />
                <span>{diary.mood}</span>
              </>
            ) : (
              <span>없음</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1 font-semibold">날씨</span>
            {diary.weather ? (
              <>
                <img src={`/weather/${diary.weather}.png`} alt="weather" className="mb-1 h-6 w-6" />
                <span>{diary.weather}</span>
              </>
            ) : (
              <span>없음</span>
            )}
          </div>
        </div>

        <DeleteConfirmDialog onConfirm={handleDelete}>
          <Button variant="outline" className="mb-2 flex w-full items-center justify-center gap-2 bg-red-100">
            <Trash2 />
            삭제하기
          </Button>
        </DeleteConfirmDialog>
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-2 bg-[#EFF3FF]"
          onClick={() => router.push(`/diary/edit/${diary.id}`)}
        >
          <Pencil />
          수정하기
        </Button>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
