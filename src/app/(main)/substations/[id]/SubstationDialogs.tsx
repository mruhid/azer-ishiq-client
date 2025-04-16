"use client";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { AlertCircle, Loader2Icon, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
const MapOnlyRead = dynamic(() => import("@/components/MapOnlyRead"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-[350px] items-center justify-center rounded-xl">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function DeleteSubtationDialog({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
interface MapComponentProps {
  initialCoords: { lat: number; lng: number } | null;
}
interface MapComponentTableProp {
  initialCoords: { lat: number; lng: number } | null;
  ids:{
    subsId: number | null;
    districtId: number | null;
    regionId: number | null;

  }
}

export function SubstationMapDialog({ initialCoords }: MapComponentProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer rounded-xl border border-secondary px-2 py-1 transition-all duration-300 hover:border-muted-foreground">
          Click for see on the map
        </span>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-2xl border border-muted-foreground/40 bg-card shadow-lg backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Substation location</DialogTitle>
        </DialogHeader>
        <div className="mx-auto">
          {initialCoords ? (
            <MapOnlyRead
              size={300}
              initialCoords={{
                lat: initialCoords.lat,
                lng: initialCoords.lng,
              }}
            />
          ) : (
            <p className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle size={18} /> Location data unavailable.
            </p>
          )}
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export const SubstationTableMapDialog = ({
  initialCoords,
  ids,
}: MapComponentTableProp) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p className="cursor-pointer">View location</p>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden border-none bg-transparent p-2 shadow-none">
        <DialogClose asChild>
          <Button
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full border border-secondary bg-secondary text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/70 hover:text-secondary"
          >
            <XIcon />
          </Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Substation location</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          {" "}
          {initialCoords ? (
            <MapOnlyRead
              size={400}
              initialCoords={{
                lat: initialCoords.lat,
                lng: initialCoords.lng,
              }}
            />
          ) : (
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-y-3">
              <p className="flex items-center gap-2 text-2xl font-semibold text-muted-foreground text-white">
                <AlertCircle size={18} /> Location data unavailable.
              </p>
              {ids.subsId&&ids.regionId&&ids.districtId ? (
                <Link
                  href={`/substations/${ids.subsId}/edit?region=${ids.regionId}&district=${ids.districtId}`}
                  className="w-full"
                >
                  <div className="mx-auto w-full max-w-[400px]">
                    <Button className="mx-auto text-lg h-12 w-full rounded-xl border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-transparent ">
                      Update substation location
                    </Button>
                  </div>
                </Link>
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
