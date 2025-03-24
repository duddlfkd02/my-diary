import useUser from "@/hooks/useUser";
import { deleteDiary, getDiaries } from "@/libs/diaryApi";
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

  const handleDelete = async (id: string) => {
    if (!user) return;

    const confirmDelete = confirm("해당 일기를 삭제하시나요?");
    if (!confirmDelete) return;

    try {
      await deleteDiary(id);
      const updated = await getDiaries(user.id);
      setDiaries(updated);
      alert("일기가 삭제되었습니다.");
    } catch (error) {
      console.error("일기 삭제 실패", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4">
      {diaries.length > 0 ? (
        diaries.map((diary) => (
          <div key={diary.id} className="mb-2 rounded-lg border p-4">
            <p>{diary.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => router.push(`/diary/edit/${diary.id}`)}
                className="text-sm text-blue-500 underline"
              >
                ✏️
              </button>
              <button onClick={() => handleDelete(diary.id!)} className="text-sm text-red-500 underline">
                🗑️
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>작성된 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
