"use server";
import { validateRequest } from "@/lib/session";
import { SubstationProps } from "@/lib/type";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, useState } from "react";
import ImageBox from "@/components/ImageBox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  AlertCircle,
  HomeIcon,
  ImageIcon,
  Loader2Icon,
  MapPinIcon,
  Cable,
  Building2Icon,
  XIcon,
} from "lucide-react";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { Button } from "@/components/ui/button";
import DeleteSubtationDialog, {
  SubstationMapDialog,
} from "./SubstationDialogs";
import { sendRequest } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const MapOnlyRead = dynamic(() => import("@/components/MapOnlyRead"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-[350px] items-center justify-center rounded-xl">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});
const getSubstation = cache(
  async (id: number): Promise<SubstationProps | null> => {
    try {
      const { session } = await validateRequest();
      if (!session) {
        return null;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation/${id}`;
      const substation = await sendRequest<SubstationProps>(
        url,
        "GET",
        session,
      );

      return substation;
    } catch (error) {
      console.error("Error fetching substation:", error);
      return null;
    }
  },
);

export async function generateMetadata({
  params: { id },
}: {
  params: { id: number };
}): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const substation = await getSubstation(id);
  return {
    title: substation
      ? `${substation.name} | Substation Info`
      : "Substation Not Found",
  };
}
type Props = {
  params: {
    id: number;
  };
};

export default async function Page({ params }: Props) {
  const substation = await getSubstation(params.id);

  if (!substation) return notFound();

  return (
    <main className="mx-auto flex min-h-screen flex-col-reverse flex-wrap-reverse items-center justify-center gap-6 p-4 md:flex-row md:justify-around md:gap-0 md:px-10 lg:flex-nowrap">
      {/* Left Section: Info & Actions */}
      <div className="space-y-4">
        <h1 className="text-center text-4xl font-bold leading-tight text-foreground md:text-start">
          Smart Way to <br />
          <span className="text-blue-600">Find a Modern Substation</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          Substation details and location.
        </p>

        <div className="space-y-3 text-base">
          <div className="flex items-center gap-2">
            <HomeIcon className="text-primary" size={20} />
            <span className="font-medium">Name:</span>
            <span>{substation.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2Icon className="text-primary" size={20} />
            <span className="font-medium">Region:</span>
            <span>{substation.district.region.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cable className="text-primary" size={20} />
            <span className="font-medium">District:</span>
            <span>{substation.district.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="text-primary" size={20} />
            <span className="font-medium">Location:</span>
            <SubstationMapDialog
              initialCoords={
                substation.location
                  ? {
                      lat: substation.location.latitude,
                      lng: substation.location.longitude,
                    }
                  : null
              }
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
          <Link
            href={`/substations/${substation.id}/edit?region=${substation.district.region.id}&district=${substation.district.id}`}
          >
            <Button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary sm:w-[200px]">
              Edit
            </Button>
          </Link>
          <DeleteSubtationDialog id={substation.id} />
        </div>
      </div>

      {/* Right Section: Image with behind blue box */}

      <div className="relative flex items-center justify-center">
        {/* Background shape */}
        <div className="absolute right-0 top-1/2 z-0 hidden h-[130%] w-[100%] -translate-y-1/2 translate-x-1/4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 lg:flex" />

        {/* Dialog trigger and content */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative z-[1] cursor-pointer">
              <ImageBox
                size={400}
                imgSrc={
                  substation.images.length > 0
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${substation.images[0]?.id}`
                    : ""
                }
                className="rounded-xl border-4 border-background object-cover shadow-xl transition-all hover:scale-[1.02]"
              />
            </div>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden border-none bg-transparent p-0 shadow-none">
            <DialogClose asChild>
              <Button className="absolute right-4  z-10 rounded-full border border-secondary bg-secondary p-2 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/70 hover:text-secondary">
                <XIcon />
              </Button>
            </DialogClose>
            <div className="flex items-center justify-center">
              <img
                src={
                  substation.images.length > 0
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${substation.images[0]?.id}`
                    : ""
                }
                alt="Substation"
                className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl duration-300 animate-in fade-in zoom-in-95"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
