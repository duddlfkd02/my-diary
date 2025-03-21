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
