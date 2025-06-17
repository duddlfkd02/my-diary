import Link from "next/link";
import { ChartColumnBig, House, PencilLine } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MenuBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const iconStyle = (active: boolean) => (active ? "text-blue" : "text-gray-300");

  return (
    <div className="flex min-h-20 w-full items-center justify-evenly rounded-lg bg-gray-50 text-center">
      <Link href="/diary" className="text-xs">
        <House className={`${iconStyle(isActive("/diary"))}`} />홈
      </Link>

      <Link href="/diary/statistics" className="text-xs">
        <ChartColumnBig className={`${iconStyle(isActive("/diary/statistics"))}`} /> 차트
      </Link>
      <Link href="/diary/write" className="text-xs">
        <PencilLine className={`${iconStyle(isActive("/diary/write"))}`} /> 작성
      </Link>
    </div>
  );
}
