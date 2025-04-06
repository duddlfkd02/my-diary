"use client";

import useUser from "@/hooks/useUser";
import { createDiary, updateDiary } from "@/libs/diaryApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";
import { Diary } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { Save } from "lucide-react";
import { Button } from "./ui/button";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        description: "로그인이 필요합니다."
      });
      return;
    }

    const diaryData = {
      user_id: user.id,
      content,
      mood,
      weather,
      ...(date ? { date } : {})
    };

    try {
      if (isEdit && initialData?.id) {
        await updateDiary(initialData.id, diaryData);
        toast({
          description: "일기가 수정되었습니다."
        });
      } else {
        await createDiary(diaryData);
        toast({
          description: "일기 저장 완료!"
        });
      }
      router.push("/diary");
    } catch (error) {
      console.error("일기 저장 오류 발생", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-4 flex">
        <h2 className="text-xl font-semibold text-darkText">오늘 있었던 일을 기록해보세요.</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="å rounded border border-none bg-transparent pl-4 text-sm text-darkText"
        />
      </div>

      <textarea
        className="m-4 h-64 w-full max-w-sm resize-none rounded-md border p-4 text-sm text-darkText focus:outline-none"
        placeholder="오늘 하루를 기록하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex gap-6">
        <IconSelector value={mood} setValue={setMood} options={moodOptions} />
        <IconSelector value={weather} setValue={setWeather} options={weatherOptions} />
      </div>

      <div className="mt-4">
        <Button size="icon" variant="ghost" onClick={handleSubmit} className="rounded-full hover:bg-[#728FDF]">
          {isEdit ? <Pencil className="text-ivory" /> : <Save className="text-ivory" />}
        </Button>
      </div>
    </div>
  );
};

export default DiaryForm;
