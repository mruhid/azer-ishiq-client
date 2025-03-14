import avatarPlaceholder from "@/assets/buildding-placeholder.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imgSrc: string | null | undefined;
  size?: number;
  className?: string;
}

export default function ImageBox({
  imgSrc,
  size = 48,
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-secondary",
        `w-[${size}px] h-[${size}px]`,
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={
          imgSrc ||
          (typeof avatarPlaceholder === "string"
            ? avatarPlaceholder
            : avatarPlaceholder.src)
        }
        alt="User Avatar"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
