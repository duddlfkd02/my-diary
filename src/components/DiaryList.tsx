import useUser from "@/hooks/useUser";
import { getDiaries } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";
import { cn } from "@/lib/utils";

const DiaryList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const moodOptions = [
    { label: "happy", src: "/mood/happy.png" },
    { label: "sad", src: "/mood/sad.png" },
    { label: "angry", src: "/mood/angry.png" },
    { label: "tired", src: "/mood/tired.png" }
  ];

  useEffect(() => {
    if (user) {
      getDiaries(user.id, selectedMood || undefined, sortOrder)
        .then((data) => setDiaries(data))
        .catch((error) => console.error("다이어리 목록 불러오기 실패:", error));
    }
  }, [user, selectedMood, sortOrder]);

  return (
    <div className="px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setSelectedMood(null);
            setSortOrder("newest");
          }}
          className={cn(
            "rounded-full border px-4 py-1 text-sm text-ivoryLight transition",
            selectedMood === null ? "bg-ivoryLight font-semibold text-blue" : "border-blue"
          )}
        >
          전체
        </button>
        <button
          onClick={() => setSortOrder("newest")}
          className={cn(
            "rounded-full border px-4 py-1 text-sm text-ivoryLight transition",
            sortOrder === "newest" ? "bg-ivoryLight font-semibold text-blue" : "border-gray-300"
          )}
        >
          최신순
        </button>
        <button
          onClick={() => setSortOrder("oldest")}
          className={cn(
            "rounded-full border px-4 py-1 text-sm text-ivoryLight transition",
            sortOrder === "oldest" ? "bg-ivoryLight font-semibold text-blue" : "border-gray-300"
          )}
        >
          오래된순
        </button>
        <IconSelector title="기분별" value={selectedMood || ""} setValue={setSelectedMood} options={moodOptions} />
      </div>

      {diaries.length > 0 ? (
        <div className="flex flex-col gap-4">
          {diaries.map((diary) => (
            <div
              key={diary.id}
              onClick={() => router.push(`/diary/${diary.id}`)}
              className="cursor-pointer rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg dark:bg-muted"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">{diary.date}</p>
                {diary.mood && <img src={`/mood/${diary.mood}.png`} alt={diary.mood} className="h-5 w-5" />}
              </div>
              <p className="text-sm text-darkText dark:text-gray-200">
                {diary.content.length > 60 ? `${diary.content.slice(0, 60)}...` : diary.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>작성된 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
