import { Diary } from "@/types/diary";
import { supabase } from "./supabase";

export const createDiary = async (diary: Omit<Diary, "id" | "date">) => {
  const { data, error } = await supabase.from("diaries").insert([diary]).select();

  if (error) throw new Error(`다이어리 저장 실패하였습니다. ${error.message}`);
  return data;
};

export const getDiaries = async (userId: string): Promise<Diary[]> => {
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw new Error(`다이어리 데이터 불러오기 실패하였습니다.. ${error.message}`);
  return data || [];
};

export const getDiaryById = async (id: string): Promise<Diary | null> => {
  const { data, error } = await supabase.from("diaries").select("*").eq("id", id).single();

  if (error) {
    console.error("다이어리 조회 싪패", error.message);
    return null;
  }
  return data;
};

export const updateDiary = async (id: string, updatedData: Partial<Diary>) => {
  const { data, error } = await supabase.from("diaries").update(updatedData).eq("id", id).select();

  if (error) throw new Error(`다이어리 수정을 실패하였습니다. ${error.message}`);

  return data;
};
