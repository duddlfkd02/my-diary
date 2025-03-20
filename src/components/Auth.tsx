"use client";

import { supabase } from "@/libs/supabase";
import useUser from "@/hooks/useUser";

const Auth = () => {
  const { user } = useUser();

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github"
    });
    if (error) {
      console.error("github 로그인 실패", error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("로그아웃 실패", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {user ? (
        <button onClick={signOut} className="mt-4 rounded-lg bg-red-500 px-6 py-3 text-white">
          로그아웃
        </button>
      ) : (
        <button onClick={signInWithGithub} className="rounded-lg bg-black px-6 py-3 text-white">
          github 로그인
        </button>
      )}
    </div>
  );
};
export default Auth;
