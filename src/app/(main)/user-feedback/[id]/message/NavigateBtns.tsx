"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigateBtns() {
  const queryClient = useQueryClient(); // ✅ Fix: assignment
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[1000px] px-2">
      <div
        title="go back"
        onClick={async () => {
          await queryClient.invalidateQueries({
            queryKey: ["user-feedback"],
          });
          router.push("/user-feedback"); // ✅ Fix: removed extra '}'
        }}
        className="mb-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-all hover:bg-muted-foreground/10 hover:text-primary"
      >
        <MoveLeft size={30} />
      </div>
    </div>
  );
}
