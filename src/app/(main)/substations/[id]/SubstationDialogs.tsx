"use client";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteSubs } from "./action";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteSubtationDialog({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient=useQueryClient()
  const router = useRouter();

  const onSubmit = async () => {
    startTransition(async () => {
      const result = await deleteSubs(id);

      if (result.error) {
        toast({
          title: "Unsuccessful operation",
          description: result.error,
          className: "bg-destructive",
        });
      } else {
        toast({
          title: "Successful operation",
          description: "Substation was deleted successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["substations-table-feed"] });

        router.push("/substations");
      }
      setIsOpen(false);
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 bg-destructive px-4 py-3 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:bg-destructive/80">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border border-muted-foreground/40 bg-card shadow-lg backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete subtation</DialogTitle>
          <DialogDescription>
            <h2 className="text-primary">Are you sure you want to delete this substation?{" "}</h2>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            className="rounded-xl"
            onClick={onSubmit}

          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
