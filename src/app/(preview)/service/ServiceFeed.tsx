"use client";
import { useToast } from "@/components/ui/use-toast";
import { serviceItems } from "@/lib/constant";
import Link from "next/link";
import { useSession } from "../SessionProvider";

export default function ServiceFeed() {
  const { user } = useSession();
  const { toast } = useToast();
  const showToast = () => {
    toast({
      title: "Çox yaxında 🚧",
      description:
        "Bu veb səhifə hazırlıq mərhələsindədir, yaxın zamanda istifadəyə veriləcək.",
    });
  };
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {serviceItems.map((item, i) =>
        item.src ? (
          <Link
            key={i}
            href={
              item.src === "/subscriber/add"
                ? `${!user ? `/login` : `/subscriber/add`}`
                : item.src
            }
            className="flex h-[250px] cursor-pointer flex-col items-start justify-start gap-2 rounded-xl border border-muted-foreground/20 bg-secondary p-5 shadow-md transition hover:border-foreground hover:shadow-lg"
          >
            <div className="rounded-md p-2 text-yellow-600">
              <item.icon size={35} />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              {item.title}
            </h2>
            <p className="text-sm text-muted-foreground/70">
              {item.description}
            </p>
          </Link>
        ) : (
          <div
            key={i}
            onClick={showToast}
            className="flex h-[250px] cursor-pointer flex-col items-start justify-start gap-2 rounded-xl border border-muted-foreground/20 bg-secondary p-5 shadow-md transition hover:border-foreground hover:shadow-lg"
          >
            <div className="rounded-md p-2 text-yellow-600">
              <item.icon size={35} />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              {item.title}
            </h2>
            <p className="text-sm text-muted-foreground/70">
              {item.description}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
