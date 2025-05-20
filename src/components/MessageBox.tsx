import { useupdateMessaageRead } from "@/app/(main)/user-feedback/mutation";
import { format } from "date-fns";
import { Archive, Mail, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function MessageBox({
  isRead,
  id,
  fullname,
  message,
  dateTime,
}: {
  isRead: boolean;
  id: number;
  fullname: string;
  dateTime: string;
  message: string;
}) {
  const { theme } = useTheme();
  const hoverBg = theme === "dark" ? "hover:bg-card" : "hover:bg-[#eaf1fb]";
  const initialRead = useRef(isRead);
  const router = useRouter();
  const mutation = useupdateMessaageRead();
  const changeMessageStatus = (id: number, isRead: boolean) => {
    if (isRead) {
      return router.push(`/user-feedback/${id}/message`);
    }
    mutation.mutate(
      { id: id, read: isRead },
      {
        onSuccess: () => {
          return router.push(`/user-feedback/${id}/message`);
        },
      },
    );
  };

  return (
    <div
      onClick={() => changeMessageStatus(id, isRead)}
      className={`grid w-full cursor-pointer grid-cols-3 items-center rounded-sm border-b px-4 py-3 transition-all duration-200 ${
        !initialRead.current ? "bg-secondary" : "bg-secondary/50"
      } group ${hoverBg} hover:shadow-md`}
    >
      {/* Sender Name */}
      <p
        className={`truncate text-sm capitalize md:text-base ${
          initialRead.current
            ? "font-normal text-foreground/70"
            : "font-semibold text-foreground"
        }`}
      >
        {fullname}
      </p>

      {/* Message Snippet */}
      <p
        className={`truncate text-sm capitalize md:text-base ${
          initialRead.current
            ? "font-normal text-foreground/70"
            : "font-semibold text-foreground"
        }`}
      >
        {message}
      </p>

      {/* Actions + Date */}
      <div className="flex items-center justify-end gap-3 text-muted-foreground/50">
        {/* Icons visible on hover */}
        <div className="hidden items-center gap-4 text-foreground/60 group-hover:flex">
          <button title="Archive">
            <Archive size={20} />
          </button>
          {/* <button title="Delete">
            <Trash2 size={20} />
          </button> */}
          <button title="Open">
            <Mail size={20} />
          </button>
        </div>
        {/* Date always visible */}
        <p className="min-w-[50px] text-right text-xs text-muted-foreground">
          {format(new Date(dateTime), "d MMM")}
        </p>
      </div>
    </div>
  );
}
