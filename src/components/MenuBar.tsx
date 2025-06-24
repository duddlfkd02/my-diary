import Link from "next/link";
import { ChartColumnBig, PencilLine, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/libs/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function MenuBar() {
  const router = useRouter();

  const MenuItem = ({
    href,
    label,
    Icon
  }: {
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link href={href} className="group flex flex-col items-center justify-center text-xs">
        <Icon className={`transition ${isActive ? "text-blue" : "text-gray-300"} group-hover:text-blue`} />
        {label}
      </Link>
    );
  };

  const queryClient = useQueryClient();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    queryClient.clear();

    alert("로그아웃 되었습니다. 로그인 페이지로 넘어갑니다.");

    router.push("/");
    if (error) {
      console.log("로그아웃 실패", error.message);
    }
  };

  return (
    <div className="flex min-h-20 w-full items-center justify-evenly rounded-lg bg-gray-50 text-center">
      <button onClick={signOut} className="flex flex-col items-center justify-center text-xs">
        <LogOut className="text-gray-300 transition hover:text-blue" />
        로그아웃
      </button>

      <MenuItem href="/diary/statistics" label="차트" Icon={ChartColumnBig} />
      <MenuItem href="/diary/write" label="작성" Icon={PencilLine} />
    </div>
  );
}
