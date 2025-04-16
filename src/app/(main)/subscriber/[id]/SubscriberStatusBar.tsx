"use client";
import {
  FileScan,
  ReceiptText,
  Unplug,
  UserCheckIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

type listProps = {
  name: string;
  src: string;
  icon: React.ElementType;
  color: string;
};
export default function SubscriberStatusBar({
  id,
  status,
}: {
  id: number;
  status: number;
}) {
  const list: listProps[][] = [
    [
      {
        name: "Application acceptance",
        src: "/subscriber",
        color: "bg-green-800",
        icon: ReceiptText,
      },
      {
        name: "Generate code",
        color: "bg-green-600",
        src: `/subscriber/${id}/code-for-subscriber`,
        icon: FileScan,
      },
      {
        name: "Electric meter",
        color: "bg-gray-300",
        src: `/subscriber/${id}/sb-counter`,
        icon: Zap,
      },
      {
        name: "TM connection",
        color: "bg-gray-300",
        src: `/subscriber/${id}/sb-tm`,
        icon: Unplug,
      },
      {
        name: "The contract",
        color: "bg-gray-300",
        src: "/subscriber/${id}/sb-contract",
        icon: UserCheckIcon,
      },
    ],
    [
      {
        name: "Application acceptance",
        src: "/subscriber",
        color: "bg-green-800",
        icon: ReceiptText,
      },
      {
        name: "Generate code",
        color: "bg-green-700",
        src: `/subscriber/${id}/code-for-subscriber`,
        icon: FileScan,
      },
      {
        name: "Electric meter",
        color: "bg-green-500",
        src: `/subscriber/${id}/sb-counter`,
        icon: Zap,
      },
      {
        name: "TM connection",
        color: "bg-gray-300",
        src: `/subscriber/${id}/sb-tm`,
        icon: Unplug,
      },
      {
        name: "The contract",
        color: "bg-gray-300",
        src: "/",
        icon: UserCheckIcon,
      },
    ],
    [
      {
        name: "Application acceptance",
        src: "/subscriber",
        color: "bg-green-800",
        icon: ReceiptText,
      },
      {
        name: "Generate code",
        color: "bg-green-700",
        src: `/subscriber/${id}/code-for-subscriber`,
        icon: FileScan,
      },
      {
        name: "Electric meter",
        color: "bg-green-600",
        src: `/subscriber/${id}/sb-counter`,
        icon: Zap,
      },
      {
        name: "TM connection",
        color: "bg-green-500",
        src: `/subscriber/${id}/sb-tm`,
        icon: Unplug,
      },
      {
        name: "The contract",
        color: "bg-gray-300",
        src: "/subscriber/${id}/sb-contract",
        icon: UserCheckIcon,
      },
    ],
    [
      {
        name: "Application acceptance",
        src: "/subscriber",
        color: "bg-green-800",
        icon: ReceiptText,
      },
      {
        name: "Generate code",
        color: "bg-green-700",
        src: `/subscriber/${id}/code-for-subscriber`,
        icon: FileScan,
      },
      {
        name: "Electric meter",
        color: "bg-green-600",
        src: `/subscriber/${id}/sb-counter`,
        icon: Zap,
      },
      {
        name: "TM connection",
        color: "bg-green-500",
        src: `/subscriber/${id}/sb-tm`,
        icon: Unplug,
      },
      {
        name: "The contract",
        color: "bg-green-400",
        src: `/subscriber/${id}/sb-contract`,
        icon: UserCheckIcon,
      },
    ],
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {list[status - 2].map((item, index) =>
        index < status ? (
          <motion.div variants={fadeIn("rihht", "spring", index * 0.5, 0.75)}>
            <Link
              href={item.src}
              key={index}
              className={`flex w-full flex-col items-center justify-center py-3 px-1  ${item.color} ${index  < status ? `cursor-pointer` : `cursor-not-allowed`} rounded-md shadow-md`}
            >
              <div className="flex items-center justify-center rounded-full bg-white p-1">
                <item.icon size={32} className="text-black" />
              </div>
              <p
                className={`mt-2 text-center text-sm font-bold ${index  < status ? `text-white` : `text-black`}`}
              >
                {item.name}
              </p>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeIn("rihht", "spring", index * 0.5, 0.75)}
            key={index}
            className={`flex w-full flex-col items-center justify-center p-1 ${item.color} ${index + 1 < status ? `cursor-pointer` : `cursor-not-allowed`} rounded-sm shadow-md`}
          >
            <div className="flex items-center justify-center rounded-full bg-white p-1">
              <item.icon size={32} className="text-black" />
            </div>
            <p
              className={`mt-2 text-center text-sm font-bold ${index + 1 < status ? `text-white` : `text-black`}`}
            >
              {item.name}
            </p>
          </motion.div>
        ),
      )}
    </div>
  );
}
