"use client";

import DiaryForm from "@/components/diary/DiaryForm";
import useUser from "@/hooks/useUser";
import { getDiaryById } from "@/libs/diaryApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const EditDiaryPage = () => {
  // const { id } = useParams() as { id: string };

  const params = useParams();
  const id = params?.id;

  //id 타입가드
  if (!id || typeof id !== "string") {
    return <p className="mt-8 text-center">잘못된 접근입니다</p>;
  }

  const { user } = useUser();
  const guestUserId = process.env.NEXT_PUBLIC_GUEST_USER_ID;

  if (!user && !guestUserId) {
    return <p className="mt-8 text-center">유저 정보를 찾을 수 없습니다.</p>;
  }
  const userId = user ? user.id : guestUserId!;

  const {
    data: initialData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["diary", id],
    queryFn: () => getDiaryById(id, userId),
    enabled: !!id
  });

  if (isLoading) return <p className="mt-8 text-center">일기 데이터를 불러오고 있어요</p>;
  if (isError || !initialData) return <p className="mt-8 text-center">일기를 찾을 수 없어요</p>;

  return (
    <div className="flex min-h-screen flex-col items-center">
      <DiaryForm initialData={initialData} isEdit={true} />
    </div>
  );
};

export default EditDiaryPage;
