"use client";

import { useQueryClient } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigateBtns() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-6xl px-2">
      <div
        title="Go Back"
        onClick={async () => {
          await queryClient.invalidateQueries({ queryKey: ["user-feedback"] });
          router.push("/user-feedback");
        }}
        className="my-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-all hover:bg-muted-foreground/10 hover:text-primary"
      >
        <MoveLeft size={28} />
      </div>
    </div>
  );
}
