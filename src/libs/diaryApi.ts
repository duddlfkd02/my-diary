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

  // 전체 & 월간 카운트
  const { count: totalCount } = await supabase
    .from("diaries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: monthlyCount } = await supabase
    .from("diaries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("date", startOfMonth)
    .lte("date", today);

  // streak 계산용: 최근 30일간 일기 날짜만 가져오기
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data: streakDiaries } = await supabase
    .from("diaries")
    .select("date")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString())
    .lte("date", today)
    .order("date", { ascending: false });

  // 날짜 문자열 배열 만들기 (yyyy-mm-dd 형식)
  const writtenDates = new Set((streakDiaries ?? []).map((d) => new Date(d.date).toISOString().slice(0, 10)));

  // streak 계산
  let streak = 0;
  let cursor = new Date();
  cursor.setDate(cursor.getDate() - 1); // 하루 전 날 기준으로 연속일 계산

  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (writtenDates.has(dateStr)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    total: totalCount || 0,
    monthly: monthlyCount || 0,
    streak
  };
};
