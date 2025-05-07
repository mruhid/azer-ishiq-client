"use client";
import NotFound from "@/app/(main)/not-found";
import ImageBox from "@/components/ImageBox";
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
import { SubstationProps } from "@/lib/type";
import { Loader2Icon, LocateIcon, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import updateSubstation from "./action";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import EditSubstationSelect from "./EditSubstationSelect";

const MapComponent = dynamic(() => import("@/components/MapComponents"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-[350px] items-center justify-center rounded-xl">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function UpdateSubs({
  substation,
}: {
  substation: SubstationProps | null;
}) {
  if (!substation) {
    return <NotFound />;
  }
  const [error, setError] = useState<string>();
  const searchParams = useSearchParams();

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: substation.location ? substation.location.latitude : 40.4093,
    lng: substation.location ? substation.location.longitude : 49.8671,
  });
  const [imageSrc, SetImageSrc] = useState<string>(
    substation?.images.length > 0
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${substation?.images[0]?.id}`
      : "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState(`${substation?.name}`);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      SetImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async () => {
    const region = searchParams.get("region") || substation.district.region.id;
    const district = searchParams.get("district") || substation.district.id;
    const updatedValues = {
      id: substation.id,
      name,
      regionId: String(region),
      districtId: String(district),
      image: imageFile,
      latitude: String(selectedLocation.lat),
      longitude: String(selectedLocation.lng),
    };
    startTransition(async () => {
      const { success, error, id } = await updateSubstation(updatedValues);
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
          description: "Update substation has been added",
        });
        router.push(`/substations/${id}`);
      }
    });
  };

  return (
    <>
      <EditSubstationSelect />
      <div className="flex w-full items-center justify-around rounded-xl bg-card p-2">
        <ImageBox imgSrc={imageSrc} size={240} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter substation name"
            autoComplete="off"
            className="rounded-xl border border-muted-foreground/50 bg-secondary"
          />
          <div
            className="relative flex h-40 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground bg-secondary text-muted-foreground transition-all hover:border-primary hover:bg-secondary/70 hover:text-primary"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/jpeg, image/png"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <Plus className="h-10 w-full" />
          </div>
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
            Update Substation
          </LoadingButton>
        </div>
      </div>
    </>
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
