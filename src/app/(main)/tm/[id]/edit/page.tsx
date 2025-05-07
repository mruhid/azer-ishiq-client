import UnauthorizedPage from "@/components/UnauthorizedPage";
import { validateRequest } from "@/lib/session";
import { TmDetailProps } from "@/lib/type";
import { Metadata } from "next";
import { cache } from "react";
import UpdateImg from "@/assets/updateGif.gif";
import UserAvatar from "@/components/UserAvatar";
import { notFound } from "next/navigation";
import { sendRequest } from "@/lib/utils";
import UpdateTm from "./UpdateTm";
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
    console.error("Error fetching tm:", error);
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
    title: tm ? `${tm.name} | Edit` : "TM Not Found",
  };
}

export default async function Page({ params }: { params: { id: number } }) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return <UnauthorizedPage />;
  }
  const tm = await getTm(params.id);
  if (!tm) {
    return notFound();
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <div className="mx-2 flex items-center justify-around rounded-xl bg-primary py-2 text-center text-xl font-semibold">
        <div className="px-2 text-start text-white">
          <p>{tm.name}</p>
          <p className="text-[1rem]">You can update TM data on here</p>
        </div>
        <UserAvatar avatarUrl={UpdateImg} size={80} />
      </div>
      <UpdateTm tm={tm} />
    </main>
  );
}
