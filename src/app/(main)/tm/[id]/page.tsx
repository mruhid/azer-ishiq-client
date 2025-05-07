"use server";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { validateRequest } from "@/lib/session";
import { TmDetailProps } from "@/lib/type";
import { sendRequest } from "@/lib/utils";
import {
  AlertCircle,
  Ampersand,
  Building2Icon,
  Cable,
  HomeIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import DeleteTmDialog from "./DeleteTmDialog";
import UnauthorizedPage from "@/components/UnauthorizedPage";
const MapOnlyRead = dynamic(() => import("@/components/MapOnlyRead"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-[400px] items-center justify-center rounded-xl bg-muted-foreground/70">
      <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

const getTm = cache(async (id: number): Promise<TmDetailProps | null> => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return null;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tm/${id}`;
    const tm = await sendRequest<TmDetailProps>(url, "GET", session);

    return tm;
  } catch (error) {
    console.error("Error fetching substation:", error);
    return null;
  }
});

export async function generateMetadata({
  params: { id },
}: {
  params: { id: number };
}): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const tm = await getTm(id);

  return {
    title: `(${tm ? tm.name : "Not-Found"}) TMS`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }

  const Tm = await getTm(id);
  if (!Tm) {
    return notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1000px] flex-col-reverse flex-wrap-reverse items-center justify-center gap-6 md:flex-row md:justify-around md:gap-0 md:px-10 md:py-0 lg:flex-nowrap">
      <div className="space-y-4">
        <h1 className="text-center text-4xl font-bold leading-tight text-foreground md:text-start">
          Smart Way to <br />
          <span className="text-blue-600">Find TM</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          TM details and location.
        </p>

        <div className="flex flex-col items-start justify-start gap-3 text-base">
          <div className="flex items-center gap-2">
            <HomeIcon className="text-primary" size={20} />
            <span className="font-medium">Name:</span>
            <span>{Tm.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2Icon className="text-primary" size={20} />
            <span className="font-medium">Region:</span>
            <span>{Tm.substation.district.region.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cable className="text-primary" size={20} />
            <span className="font-medium">District:</span>
            <span>{Tm.substation.district.name}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/substations/${Tm.substation.id}/`}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Ampersand className="text-primary" size={20} />
                    <span className="font-medium">Substation:</span>
                    <span>{Tm.substation.name}</span>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="border bg-card">
                <p className="text-md font-medium">
                  Click and see this substation
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
          <Link
            href={`/tm/${Tm.id}/edit?region=${Tm.substation.district.regionId}&district=${Tm.substation.districtId}&substation=${Tm.substation.id}`}
          >
            <Button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary sm:w-[200px]">
              Edit
            </Button>
          </Link>
          <DeleteTmDialog id={Tm.id} />
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        {/* Background shape */}
        <div className="absolute right-0 top-1/2 z-0 hidden h-[130%] w-[100%] -translate-y-1/2 translate-x-1/4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 lg:flex" />

        <Dialog>
          <DialogTrigger asChild>
            <div className="relative z-[1] cursor-pointer">
              {Tm.location ? (
                <MapOnlyRead
                  size={400}
                  initialCoords={{
                    lat: Tm.location.latitude,
                    lng: Tm.location.longitude,
                  }}
                />
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center gap-y-3 rounded-xl border border-muted-foreground bg-secondary px-2">
                  <p className="flex items-center gap-2 text-2xl font-semibold text-muted-foreground">
                    <AlertCircle size={18} /> Location data unavailable.
                  </p>
                </div>
              )}
            </div>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden border-none bg-transparent p-0 shadow-none">
            <DialogClose className="top-4" asChild>
              <Button className="absolute right-4 z-10 rounded-full border border-secondary bg-secondary p-2 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/70 hover:text-secondary">
                <XIcon />
              </Button>
            </DialogClose>
            <div className="flex h-full items-center justify-center">
              {Tm.location ? (
                <MapOnlyRead
                  size={400}
                  initialCoords={{
                    lat: Tm.location.latitude,
                    lng: Tm.location.longitude,
                  }}
                />
              ) : (
                <div className="flex h-[300px] w-full flex-col items-center justify-center gap-y-3">
                  <p className="flex items-center gap-2 text-2xl font-semibold text-muted-foreground text-white">
                    <AlertCircle size={18} /> Location data unavailable.
                  </p>

                  <Link
                    href={`/tm/${Tm.id}/edit?region=${Tm.substation.district.regionId}&district=${Tm.substation.districtId}&substation=${Tm.substation.id}`}
                    className="w-full"
                  >
                    <div className="mx-auto w-full max-w-[400px]">
                      <Button className="mx-auto h-12 w-full rounded-xl border border-transparent bg-primary text-lg capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-transparent">
                        Update tm location
                      </Button>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
