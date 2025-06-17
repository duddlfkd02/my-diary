import { Diary } from "@/types/diary";
import { supabase } from "./supabase";

export const createDiary = async (diary: Omit<Diary, "id" | "date">) => {
  const { data, error } = await supabase.from("diaries").insert([diary]).select();

  if (error) throw new Error(`다이어리 저장 실패하였습니다. ${error.message}`);
  return data;
};

export const getDiaries = async (
  userId: string,
  mood?: string,
  sort: "newest" | "oldest" = "newest"
): Promise<Diary[]> => {
  let query = supabase.from("diaries").select("*").eq("user_id", userId);

  if (mood) {
    query = query.eq("mood", mood);
  }

  const { data, error } = await query.order("created_at", { ascending: sort === "oldest" });

  if (error) throw new Error(`다이어리 데이터 불러오기 실패하였습니다.. ${error.message}`);
  return data || [];
};

export const getDiaryById = async (id: string): Promise<Diary | null> => {
  const { data, error } = await supabase.from("diaries").select("*").eq("id", id).single();

  if (error) {
    console.error("다이어리 조회 실패", error.message);
    return null;
  }
  return data;
};

export const updateDiary = async (id: string, updatedData: Partial<Diary>) => {
  const { data, error } = await supabase.from("diaries").update(updatedData).eq("id", id).select();

  if (error) throw new Error(`다이어리 수정을 실패하였습니다. ${error.message}`);

  return data;
};

export const deleteDiary = async (id: string): Promise<void> => {
  const { error } = await supabase.from("diaries").delete().eq("id", id);

  if (error) {
    throw new Error(`다이어리 삭제 실패하였습니다. ${error.message}`);
  }
};

// 한 달 전체 일기를 가져오는 함수
export const getDiariesByMonth = async (userId: string, year: number, month: number) => {
  const start = new Date(year, month, 1).toISOString(); // 해당 월 1일
  const end = new Date(year, month + 1, 1).toISOString(); // 다음 달 1일

  const { data, error } = await supabase
    .from("diaries")
    .select("date, mood")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end);

  if (error) throw new Error(error.message);
  return data || [];
};

// 달력 날짜 클릭 시 해당 일기 불러오기
export const getDiaryByDate = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data || null;
};

// 감정별 통계 API
export const getMoodStats = async (userId: string, year: number, month: number) => {
  const start = new Date(year, month - 1, 1).toISOString().slice(0, 10); // yyyy-mm-dd
  const end = new Date(year, month, 1).toISOString().slice(0, 10);

  const { data, error } = await supabase.rpc("get_mood_stats", {
    uid: userId,
    start_date: start,
    end_date: end
  });

  if (error) throw new Error(`감정 통계 불러오기 실패: ${error.message}`);
  return data;
};

// 감정 개수 가져오기
export const getDiaryStats = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const today = new Date().toISOString();

  // 전체 일기 수
  const { count: totalCount, error: totalError } = await supabase
    .from("diaries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // 이번 달 작성한 일기 수
  const { count: monthlyCount, error: monthlyError } = await supabase
    .from("diaries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("date", startOfMonth)
    .lte("date", today);

  if (totalError || monthlyError) {
    throw new Error("일기 통계 조회 실패");
  }

  return {
    total: totalCount || 0,
    monthly: monthlyCount || 0,
    streak: 0 // 추후 연속 작성일 수 계산 로직을 추가해도 ㄱㅊ
  };
};
