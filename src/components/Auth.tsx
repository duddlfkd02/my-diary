"use client";

import { supabase } from "@/libs/supabase";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const Auth = () => {
  const { user } = useUser();
  const router = useRouter();

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

  const signInWithGoogle = async () => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) {
      console.error("Google 로그인 실패", error.message);
    }
  };

  const handleGuestLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "guest@naver.com",
      password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!
    });
    if (error) {
      console.error("게스트 로그인 실패", error.message);
      alert("비회원 로그인에 실패했습니다.");
      return;
    }

    alert("비회원 로그인으로 접속합니다.");
    router.push("/diary");
  };

  return (
    <div className="bg-blue-100 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-sm">
      {/* 상단 logo & 소개 */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <img src="/icons/icon-512x512.png" alt="logo" className="h-16 w-16" />
        <h1 className="text-2xl font-bold">My Diary</h1>
        <p className="text-sm text-gray-600">감정과 함께하는 나만의 일기장</p>
      </div>

      {/* 로그인 버튼 */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={signInWithGoogle}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition hover:bg-blue/10"
        >
          <img src="/icons/google.png" alt="Google" className="h-5 w-5" />
          Google로 로그인
        </button>

        <button
          onClick={signInWithGithub}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition hover:bg-blue/10"
        >
          <img src="/icons/github.png" alt="Github" className="h-5 w-5" />
          GitHub로 로그인
        </button>

        <div className="relative my-2 flex items-center justify-center">
          <hr className="w-full border-gray-300" />
        </div>

        <button
          onClick={handleGuestLogin}
          className="rounded-lg border border-red-200 px-4 py-3 font-semibold text-redAccent transition hover:bg-redAccent/10"
        >
          비회원 이용
        </button>

        <p className="mt-1 text-center text-xs text-gray-500">* 비회원 체험 시 일부 기능이 제한될 수 있습니다.</p>
      </div>
    </div>
  );
};
export default Auth;
