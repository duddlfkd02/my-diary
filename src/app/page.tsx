"use client";

import Auth from "@/components/Auth";
import useUser from "@/hooks/useUser";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {user ? (
        <div className="text-center">
          <p className="text-lg font-semibold">
            반갑습니다! <br />
            {user.email}
          </p>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
      <Auth />
    </div>
  );
};

export default Home;
