import { validateRequest } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) {
    return (
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute left-0 top-0 h-full w-full object-cover"
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
  if (
    session.user.roles.length === 1 &&
    session.user.roles[0].toLowerCase() === "user"
  ) {
    return redirect(`/user-account/${session.user.id}`);
  }
  redirect("/");
}
