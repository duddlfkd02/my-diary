"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { CircleAlert, Heart, TriangleAlert } from "lucide-react";

interface GuestLoginProps {
  onConfirm: () => void;
  children: ReactNode;
}

const GuestLoginDialog = ({ onConfirm, children }: GuestLoginProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="space-y-4 rounded-xl p-6 text-center">
        <div className="flex flex-col items-center space-y-1">
          <TriangleAlert size={32} className="mb-2 text-yellow-500" />

          <h2 className="text-xl font-bold">비회원 체험 모드</h2>
          <p className="text-sm text-gray-600">잠깐! 확인해주세요</p>
        </div>

        <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-left text-sm text-redAccent">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert /> 비회원 체험 제한사항
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>기능 확인을 위한 테스트 용도입니다.</li>
            <li>브라우저를 닫으면 모든 데이터가 사라질 수 있습니다.</li>
            <li>감정 통계 등의 일부 기능이 제한될 수 있습니다.</li>
          </ul>
        </div>

        <div className="rounded-md border border-blue bg-blue/10 p-4 text-left text-sm text-blue">
          <p className="mb-1 flex items-center gap-2 font-semibold">
            <Heart />
            추천
          </p>
          <p>안정적인 이용을 위해 로그인을 권장합니다!</p>
        </div>

        <AlertDialogFooter className="flex flex-row justify-between gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" className="flex-1">
              로그인하기
            </Button>
          </AlertDialogCancel>
          <AlertDialogCancel asChild>
            <Button onClick={onConfirm} className="hover:bg-blue-600 flex-1 border-none bg-blue text-white">
              체험 계속하기
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GuestLoginDialog;
