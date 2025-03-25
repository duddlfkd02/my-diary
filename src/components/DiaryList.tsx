import useUser from "@/hooks/useUser";
import { getDiaries } from "@/libs/diaryApi";
import { Diary } from "@/types/diary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DiaryList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    if (user) {
      getDiaries(user.id)
        .then((data) => setDiaries(data))
        .catch((error) => console.error("다이어리 목록 불러오기 실패:", error));
    }
  }, [user]);

  return (
    <div className="p-4">
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
