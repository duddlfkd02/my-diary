import useUser from "@/hooks/useUser";
import { getDiaries } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";

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
    <div className="p-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedMood(null);
            setSortOrder("newest");
          }}
          className={selectedMood === null ? "font-bold" : ""}
        >
          전체
        </button>
        <button onClick={() => setSortOrder("newest")} className={sortOrder === "newest" ? "font-bold" : ""}>
          최신순
        </button>
        <button onClick={() => setSortOrder("oldest")} className={sortOrder === "oldest" ? "font-bold" : ""}>
          오래된순
        </button>
        <IconSelector title="기분별" value={selectedMood || ""} setValue={setSelectedMood} options={moodOptions} />
      </div>
      {diaries.length > 0 ? (
        diaries.map((diary) => (
          <div
            key={diary.id}
            className="mb-2 cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
            onClick={() => router.push(`/diary/${diary.id}`)}
          >
            <p className="text-sm text-gray-700">
              {diary.content.length > 50 ? diary.content.slice(0, 50) + "..." : diary.content}
            </p>
          </div>
        ))
      ) : (
        <p>작성된 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
