"use client";
import Link from "next/link";
import notFoundImg from "@/assets/not-found.svg";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex w-full items-center justify-around space-y-2">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404-error</h1>
        <h2 className="mt-2 text-3xl font-semibold">PAGE NOT FOUND</h2>
        <p className="mt-4 text-muted-foreground">
          Your searched link not found on the Azerishiq.
        </p>
        <Link
          href="/"
          className="hover:bg-primary-90 mt-6 inline-block rounded-full border border-primary/90 px-6 py-3 text-lg transition-all hover:bg-primary/90"
        >
          Back To Home
        </Link>
      </div>
      <motion.div
        className="mb-4 flex items-center justify-center rounded-full bg-black p-6"
        animate={{
          rotate: [0, 360],
          x: [0, 15, 15, -15, 0],
          y: [0, -15, 15, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
      >
        <div className="mt-10 hidden sm:flex">
          <Image
            src={notFoundImg}
            alt='"Astronaut floating'
            className="w-[200px]"
          />
        </div>
      </motion.div>
    </div>
  );
}
