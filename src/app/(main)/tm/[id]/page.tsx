"use server"
import { validateRequest } from "@/lib/session";
import { SubstationProps, TMProps } from "@/lib/type";
import { sendRequest } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

const getTm = cache(
  async (id: number): Promise<SubstationProps | null> => {
    try {
      const { session } = await validateRequest();
      if (!session) {
        return null;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/tm/${id}`;
      const tm = await sendRequest<SubstationProps>(
        url,
        "GET",
        session,
      );

      return tm; 
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

  const tm = await getTm(id);

  return {
    title: `(${tm?tm.name:"Not-Found"}) TMS`,
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
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const Tm = await getTm(id);
  if(!Tm){
    return notFound()
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      {Tm.name}
    </main>
  );
}
