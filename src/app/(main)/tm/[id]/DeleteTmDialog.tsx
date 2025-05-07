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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTM } from "./action";

export default function DeleteTmDialog({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const onSubmit = async () => {
    startTransition(async () => {
      const result = await deleteTM(id);

      if (result.error) {
        toast({
          title: "Unsuccessful operation",
          description: result.error,
          className: "bg-destructive",
        });
      } else {
        toast({
          title: "Successful operation",
          description: "Tm was deleted successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["Tms-table-feed"] });

        router.push("/");
      }
      setIsOpen(false);
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-destructive capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary sm:w-[200px]">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-2xl border border-muted-foreground/40 bg-card shadow-lg backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete subtation</DialogTitle>
          <DialogDescription>
            <h2 className="text-primary">
              Are you sure you want to delete this substation?{" "}
            </h2>
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
