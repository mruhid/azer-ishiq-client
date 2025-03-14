// import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { user } = await validateRequest();

  //   if (user) redirect("/");

  return (
    <div className="relative w-full h-screen overflow-hidden">
    {/* Background Video */}
    <video
      className="absolute top-0 left-0 w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/assets/bg-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Content */}
    <div className="relative z-10">{children}</div>
  </div>
  );
}
