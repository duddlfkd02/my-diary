"use client";

import { supabase } from "@/libs/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/diary");
      } else {
        router.replace("/");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <p className="mt-20 text-center">로그인 중입니다...</p>;
}
