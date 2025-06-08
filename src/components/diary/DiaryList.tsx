"use client";

import useUser from "@/hooks/useUser";
import { getDiaries } from "@/libs/diaryApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IconSelector from "../IconSelector";
import FilterButtons from "../FilterButton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useQuery } from "@tanstack/react-query";

const DiaryList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const moodOptions = [
    { label: "happy", src: "/mood/happy.png" },
    { label: "sad", src: "/mood/sad.png" },
    { label: "angry", src: "/mood/angry.png" },
    { label: "tired", src: "/mood/tired.png" }
  ];

  const { data: diaries = [], isLoading } = useQuery({
    queryKey: ["all-diaries", user?.id],
    queryFn: () => getDiaries(user!.id),
    enabled: !!user // user가 있을 때만 실행
  });

  return (
    <div className="px-4 py-8">
      <FilterButtons
        selectedMood={selectedMood}
        sortOrder={sortOrder}
        setSelectedMood={setSelectedMood}
        setSortOrder={setSortOrder}
      />

      <div className="mb-4 flex justify-center gap-2">
        <IconSelector value={selectedMood || ""} setValue={setSelectedMood} options={moodOptions} />
      </div>

      {diaries.length > 0 ? (
        <Swiper spaceBetween={10} slidesPerView={1.5} centeredSlides={true} className="w-full max-w-md">
          {diaries.map((diary) => (
            <SwiperSlide key={diary.id}>
              <div
                className="flex h-[360px] cursor-pointer flex-col justify-between rounded-xl bg-ivory p-6 shadow-md"
                onClick={() => router.push(`/diary/${diary.id}`)}
              >
                <div className="flex-grow break-words text-sm text-darkText">{diary.content}</div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  {diary.date}
                  {diary.mood && <img src={`/mood/${diary.mood}.png`} alt={diary.mood} className="h-8 w-8 self-end" />}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">작성된 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
