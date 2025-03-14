import UnauthorizedPage from "@/components/UnauthorizedPage";
import kyInstance from "@/lib/ky";
import { validateRequest } from "@/lib/session";
import { SubstationProps } from "@/lib/type";
import { Metadata } from "next";
import { cache } from "react";
import { UpdateSubs } from "./UpdateSubs";

const getSubstation = cache(
  async (id: number): Promise<SubstationProps | null> => {
    try {
      const response = await kyInstance.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation/${id}`,
      );
      return await response.json<SubstationProps>();
    } catch (error) {
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
    title: substation ? `${substation.name} | Edit` : "Substation Not Found",
  };
}

export default async function Page({ params }: { params: { id: number } }) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }
  const substation = await getSubstation(params.id);

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <UpdateSubs substation={substation} />
    </main>
  );
}
