"use client";

import { supabase } from "@/libs/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";

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

  return (
    <p className="mt-20 text-center">
      <BeatLoader />
    </p>
  );
}
