"use client";
import DiaryList from "@/components/DiaryList";
import { useRouter } from "next/navigation";

const DiaryPage = () => {
  const router = useRouter();

  // const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  // const toggleForm = () => setIsFormVisible((prev) => !prev);
  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <button onClick={() => router.push("/diary/write")}>✏️일기쓰기</button>

      <DiaryList />
    </div>
  );
};

export default DiaryPage;
