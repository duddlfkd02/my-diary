"use client";

import useUser from "@/hooks/useUser";
import { createDiary, updateDiary } from "@/libs/diaryApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconSelector from "../IconSelector";
import { Diary } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DiaryFormProps {
  initialData?: Diary;
  isEdit?: boolean;
}

const DiaryForm = ({ initialData, isEdit = false }: DiaryFormProps) => {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [content, setContent] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [weather, setWeather] = useState<string>("");
  const [date, setDate] = useState<string>(initialData?.date || today);

  // 수정모드이면 초기값 설정
  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || "");
      setMood(initialData.mood || "");
      setWeather(initialData.weather || "");
      setDate(initialData.date || "");
    }
  }, [initialData]);

  const moodOptions = [
    { label: "happy", src: "/mood/happy.png" },
    { label: "sad", src: "/mood/sad.png" },
    { label: "angry", src: "/mood/angry.png" },
    { label: "tired", src: "/mood/tired.png" }
  ];

  const weatherOptions = [
    { label: "sunny", src: "/weather/sunny.png" },
    { label: "cloudy", src: "/weather/cloudy.png" },
    { label: "rainy", src: "/weather/rainy.png" },
    { label: "snowy", src: "/weather/snowy.png" },
    { label: "windy", src: "/weather/windy.png" }
  ];

  const queryClient = useQueryClient();

  const { mutate: saveDiary, isPending } = useMutation({
    mutationFn: async (diaryData: any) => {
      if (isEdit && initialData?.id) {
        return await updateDiary(initialData.id, diaryData);
      } else {
        return await createDiary(diaryData);
      }
    },
    onSuccess: () => {
      toast({
        description: isEdit ? "일기가 수정되었습니다." : "일기 저장 완료!"
      });
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
      router.push("/diary");
    },
    onError: (error) => {
      console.error("일기 저장 오류 발생", error);
      toast({
        description: "일기 저장 중 오류가 발생했습니다."
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const guestUserId = process.env.NEXT_PUBLIC_GUEST_USER_ID;

    const diaryData = {
      user_id: user ? user.id : guestUserId,
      content,
      mood,
      weather,
      ...(date ? { date } : {})
    };

    saveDiary(diaryData);
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className="mx-auto flex min-h-screen w-full max-w-md flex-col items-start gap-6 p-6"
    >
      {/* Header */}
      <div className="mb-2 flex w-full items-center justify-between bg-blueLight px-4 py-6">
        <button type="button" onClick={() => router.back()} className="px-2 py-1">
          <ArrowLeft width={20} height={20} className="hover:text-blue" />
        </button>
        <h1 className="text-lg font-bold text-darkText">{isEdit ? "일기 수정" : "새 일기"}</h1>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-blue px-4 py-1 text-sm font-semibold text-white shadow-none hover:bg-[##6b7fb7]"
        >
          저장
        </Button>
      </div>

      {/* 날짜 입력 */}
      <div className="w-full">
        <label className="mb-1 block text-sm font-semibold text-darkText">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border px-4 py-2 text-sm text-darkText"
        />
      </div>

      {/* 날씨 선택 */}
      <div className="w-full">
        <label className="mb-2 block text-sm font-semibold text-darkText">날씨</label>
        <IconSelector type="button" value={weather} setValue={setWeather} options={weatherOptions} />
      </div>

      {/* 기분 선택 */}
      <div className="w-full">
        <label className="mb-2 block text-sm font-semibold text-darkText">오늘의 기분</label>
        <IconSelector type="button" value={mood} setValue={setMood} options={moodOptions} />
      </div>

      {/* 일기 내용 */}
      <div className="w-full">
        <label className="mb-1 block text-sm font-semibold text-darkText">일기 내용</label>
        <textarea
          className="h-48 w-full resize-none rounded-md border px-4 py-2 text-sm text-darkText"
          placeholder="오늘 있었던 일을 기록해보세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </form>
  );
};

export default DiaryForm;
