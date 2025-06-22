"use client";

import { getDiaryById } from "@/libs/diaryApi";
import { deleteDiary } from "@/libs/diaryApi";
import { useParams, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DiaryDetailPage = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const queryClient = useQueryClient();

  const guestUserId = process.env.NEXT_PUBLIC_GUEST_USER_ID;

  if (!user && !guestUserId) {
    return <p className="mt-8 text-center">유저 정보를 찾을 수 없습니다.</p>;
  }

  const userId = user ? user.id : guestUserId!;

  const { data: diary, isLoading } = useQuery({
    queryKey: ["diary", id],
    queryFn: () => getDiaryById(id, userId),
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

  return (
    <div className="min-h-screen p-4">
      <div className="mb-2 flex w-full items-center justify-between bg-blueLight px-4 py-6">
        <button type="button" onClick={() => router.back()} className="px-2 py-1">
          <ArrowLeft width={20} height={20} className="hover:text-blue" />
        </button>
        <div className="flex-1 text-center font-bold text-darkText">{formattedDate}</div>
      </div>

      <div className="m-6 mx-auto flex w-full max-w-sm justify-between rounded-xl bg-white p-6 text-sm text-gray-700 shadow">
        <div className="flex items-center gap-4">
          {diary.mood ? (
            <div className="flex flex-col">
              <img src={`/mood/${diary.mood}.png`} alt="mood" className="mb-1 h-6 w-6" />
            </div>
          ) : (
            <span>없음</span>
          )}
          <div className="flex flex-col items-center">
            <p>기분</p>
            <p className="font-bold">{diary.mood}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {diary.weather ? (
            <div className="flex flex-col">
              <img src={`/weather/${diary.weather}.png`} alt="weather" className="mb-1 h-6 w-6" />
            </div>
          ) : (
            <span>없음</span>
          )}
          <div className="flex flex-col items-center">
            <p>날씨</p>
            <p className="font-bold">{diary.weather}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-sm rounded-xl bg-white p-6 shadow">
        {/* 일기 본문 */}
        <div className="mb-10 rounded-md">
          <div className="text-md mb-2 font-semibold text-darkText">{firstSentence}</div>
          {diary.content && <p className="min-h-52 whitespace-pre-wrap text-sm text-darkText">{diary.content}</p>}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <Button
            className="flex w-full items-center justify-center hover:bg-blue/70"
            onClick={() => router.push(`/diary/edit/${diary.id}`)}
          >
            <Pencil />
            수정하기
          </Button>
          <DeleteConfirmDialog onConfirm={handleDelete}>
            <Button className="mb-2 flex w-full items-center justify-center bg-redAccent hover:bg-redAccent/70">
              <Trash2 />
              삭제하기
            </Button>
          </DeleteConfirmDialog>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetailPage;
