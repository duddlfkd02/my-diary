"use client";

import { supabase } from "@/libs/supabase";
import useUser from "@/hooks/useUser";

const Auth = () => {
  const { user } = useUser();

  const signInWithGithub = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error("Github 로그인 실패", error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패", error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      {user ? (
        <>
          <p className="text-center text-lg font-semibold">로그인 성공!</p>
          <button onClick={signOut} className="rounded-lg bg-red-500 px-6 py-3 text-white">
            로그아웃
          </button>
        </>
      ) : (
        <button onClick={signInWithGithub} className="rounded-lg bg-black px-6 py-3 text-white">
          Github 로그인
        </button>
      )}
    </div>
  );
};
export default Auth;
