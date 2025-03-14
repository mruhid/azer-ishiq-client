"use client"
import { Monitor, PcCaseIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-x-6 gap-y-4 rounded-xl p-4 text-center text-black">
      <motion.div
        className="mb-4 flex items-center justify-center rounded-full bg-black p-6"
        animate={{
          rotate: [0, 360],
          x: [0, 15, 15, -15, 0],
          y: [0, -15, 15, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
      >
        {" "}
        <Monitor size={60} className="text-muted-foreground" />
      </motion.div>
      <div className="flex flex-col items-center justify-center p-2 text-primary shadow-sm">
        <h1 className="text-2xl font-bold">YOU DON'T HAVE PERMITION</h1>
        <h2 className="mb-2 text-xl font-bold">TO VIEW THIS PAGE</h2>
        <div className="mx-auto mb-4 h-1 w-full bg-card" />
        <Link
          href="/"
          className="mt-6 rounded-lg bg-black px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-xl"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
