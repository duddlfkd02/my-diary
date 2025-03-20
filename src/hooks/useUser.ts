"use client";

import { supabase } from "@/libs/supabase";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("사용자 정보를 불러오던 중 오류 발생", error.message);
        return;
      }
      setUser(data.user);
    };
    getUser();

    // 로그인/로그아웃 상태 변경 감지 후 사용자 정보 업데이트
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user };
};

export default useUser;
