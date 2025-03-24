"use client";

import useUser from "@/hooks/useUser";
import { createDiary, updateDiary } from "@/libs/diaryApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";
import { Diary } from "@/types/diary";

interface DiaryFormProps {
  initialData?: Diary;
  isEdit?: boolean;
}

const DiaryForm = ({ initialData, isEdit = false }: DiaryFormProps) => {
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
    { label: "cloudy", src: "/weather/cloud.png" },
    { label: "rainy", src: "/weather/rain.png" },
    { label: "snowy", src: "/weather/snow.png" },
    { label: "windy", src: "/weather/wind.png" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
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
        alert("일기가 수정되었습니다.");
      } else {
        await createDiary(diaryData);
        alert("일기가 저장되었습니다.");
      }
      router.push("/diary");
    } catch (error) {
      console.error("일기 저장 오류 발생", error);
    }
  };

  return (
    <div>
      <h2>오늘 있었던 일을 기록해보세요.</h2>
      <textarea
        placeholder="오늘 하루를 기록하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="mt-2 flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border px-4 py-2"
        />
        <IconSelector title="mood" value={mood} setValue={setMood} options={moodOptions} />
        <IconSelector title="weather" value={weather} setValue={setWeather} options={weatherOptions} />
      </div>
      <button onClick={handleSubmit}>{isEdit ? "수정하기" : "저장하기"}</button>
    </div>
  );
};

export default DiaryForm;
