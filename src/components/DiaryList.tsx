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
          <div key={diary.id} className="mb-2 rounded-lg border p-4">
            <p>{diary.content}</p>
            <button onClick={() => router.push(`/diary/edit/${diary.id}`)} className="text-sm text-blue-500 underline">
              수정하기
            </button>
          </div>
        ))
      ) : (
        <p>작성된 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
