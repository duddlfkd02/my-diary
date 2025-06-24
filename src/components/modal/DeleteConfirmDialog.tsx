"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ReactNode } from "react";

interface DialogProps {
  onConfirm: () => void;
  children: ReactNode;
}

const DeleteConfirmDialog = ({ onConfirm, children }: DialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[360px] rounded-2xl px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-red-100" />
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">일기를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-gray-500">
              삭제된 일기는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="mt-6 flex justify-center">
          <AlertDialogCancel className="w-full rounded-md bg-gray-100 px-8 py-2.5 text-black">취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-full rounded-md bg-redAccent px-8 py-2.5 text-white">
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
