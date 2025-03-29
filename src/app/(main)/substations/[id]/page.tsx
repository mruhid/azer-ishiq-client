"use server";
import kyInstance from "@/lib/ky";
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
} from "lucide-react";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { Button } from "@/components/ui/button";
import DeleteSubtationDialog from "./SubstationDialogs";
import { sendRequest } from "@/lib/utils";
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

export default async function Page({ params }: { params: { id: number } }) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }

  const substation = await getSubstation(params.id);
  if (!substation) {
    return notFound();
  }

  return (
    <main className="mx-auto flex flex-col-reverse gap-x-5 gap-y-2 px-2 py-4 lg:flex-row">
      {/* Left Section: Substation Info */}
      <div className="flex-1 space-y-4">
        <SubstationInfo substation={substation} />
      </div>

      <div className="flex-1 space-y-4">
        <Card className="rounded-2xl border border-muted-foreground/40 bg-card/70 p-6 shadow-lg backdrop-blur-md">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Globe size={20} /> Substation Location
          </h2>
          <div className="mt-6 flex justify-center">
            {substation.location ? (
              <MapOnlyRead
                size={300}
                initialCoords={{
                  lat: substation.location.latitude,
                  lng: substation.location.longitude,
                }}
              />
            ) : (
              <p className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle size={18} /> Location data unavailable.
              </p>
            )}
          </div>
        </Card>
      </div>
      {/* end detail: Map */}
      <div className="flex-1 space-y-4">
        <Card className="w-full min-w-[250px] rounded-2xl border border-muted-foreground/40 bg-card/70 p-6 shadow-lg backdrop-blur-md">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <HomeIcon size={20} /> {substation.name}
          </h2>
          <div className="mt-6 flex flex-col justify-center gap-y-2 pr-2">
            <div className="grid w-full max-w-36 grid-cols-[auto_1fr] items-center gap-2 text-lg">
              <span className="font-medium">Region:</span>
              <span className="w-full rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground">
                {substation.district.region.name}
              </span>
            </div>
            <div className="grid w-full max-w-36 grid-cols-[auto_1fr] items-center gap-2 text-lg">
              <span className="font-medium">District:</span>
              <span className="rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground">
                {substation.district.name}
              </span>
            </div>
          </div>
          <div className="mt-5 flex w-full flex-col justify-center gap-3">
            <div>
              <Link
                href={`/substations/${substation.id}/edit?region=${substation.district.region.id}&district=${substation.district.id}`}
              >
                <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/80">
                  Edit
                </Button>
              </Link>
            </div>
            <div>
              <DeleteSubtationDialog id={substation.id} />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function SubstationInfo({ substation }: { substation: SubstationProps }) {
  const subsImg = substation.images;

  return (
    <Card className="rounded-2xl border border-muted-foreground/40 bg-card/70 p-6 shadow-lg backdrop-blur-md">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <ImageIcon size={20} /> Substation Image
      </h2>
      <div className="mt-6 flex justify-center">
        <ImageBox
          size={300}
          imgSrc={
            subsImg.length > 0
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${subsImg[0]?.id}`
              : ""
          }
          className="w-full max-w-lg rounded-lg border border-muted-foreground/60 shadow-md"
        />
      </div>
    </Card>
  );
}
