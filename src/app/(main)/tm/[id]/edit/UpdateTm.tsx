"use client";
import NotFound from "@/app/(main)/not-found";
import LoadingButton from "@/components/LoadingButton";
import MapSearchedPlaceInput from "@/components/MapSearchedPlaceInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TmDetailProps } from "@/lib/type";
import { Loader2Icon, LocateIcon, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import EditTmSelect from "./EditTmSelect";
import updateTmFN from "./action";

const MapComponent = dynamic(() => import("@/components/MapComponents"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-[350px] items-center justify-center rounded-xl">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function UpdateTm({ tm }: { tm: TmDetailProps | null }) {
  if (!tm) {
    return <NotFound />;
  }
  const [error, setError] = useState<string>();
  const searchParams = useSearchParams();

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: tm.location ? tm.location.latitude : 40.4093,
    lng: tm.location ? tm.location.longitude : 49.8671,
  });
  const [name, setName] = useState(`${tm?.name}`);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    const region =
      searchParams.get("region") || tm.substation.district.regionId;
    const district = searchParams.get("district") || tm.substation.districtId;
    const substation = searchParams.get("substation") || tm.substation.id;
    const updatedValues = {
      id: tm.id,
      name,
      regionId: String(region),
      districtId: String(district),
      substationId: String(substation),
      latitude: String(selectedLocation.lat),
      longitude: String(selectedLocation.lng),
    };
    startTransition(async () => {
      const { success, error, id } = await updateTmFN(updatedValues);
      if (error) {
        setError(error);
        toast({
          title: "Unsuccessful Operation",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "Tm data has been update",
        });
        router.push(`/tm/${id}`);
      }
    });
  };

  return (
    <div className="mx-2">
      <EditTmSelect />
      <div className="flex w-full items-center justify-around rounded-2xl border border-muted-foreground/40 bg-card/70 px-4 pb-6 shadow-lg backdrop-blur-md">
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          <h1 className="pb-2 pt-4 text-xl font-semibold">TM informations</h1>
          <Input
            value={name.split("-")[1]}
            onChange={(e) => setName("tm-" + e.target.value)}
            placeholder="Enter substation name"
            autoComplete="off"
            className="rounded-xl border border-muted-foreground/50 bg-secondary"
          />

          <MapDialog
            initialCoords={selectedLocation}
            onLocationSelect={setSelectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
          <LoadingButton
            loading={isPending}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-primary p-2 transition-all hover:bg-primary/70"
            disabled={!name}
          >
            Update tm
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

type Location = {
  lat: number;
  lng: number;
};

interface MapComponentProps {
  initialCoords: { lat: number; lng: number };
  onLocationSelect: (coords: Location) => void;
  setSelectedLocation: Dispatch<SetStateAction<Location>>;
}

export function MapDialog({
  initialCoords,
  onLocationSelect,
  setSelectedLocation,
}: MapComponentProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full rounded-xl p-2 transition-all hover:bg-card/20"
        >
          <LocateIcon className="mr-2" /> Change coordinate
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl border border-muted-foreground/40 bg-card shadow-lg backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Change Coordinate</DialogTitle>
        </DialogHeader>
        <div className="mx-auto p-2">
          <MapSearchedPlaceInput setSelectedLocation={setSelectedLocation} />
          <MapComponent
            initialCoords={initialCoords}
            onLocationSelect={onLocationSelect}
            size={350}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
