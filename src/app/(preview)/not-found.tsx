"use client";
import Link from "next/link";
import notFoundImg from "@/assets/not-found.svg";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative mx-4 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-secondary">
      {/* Animated Background Image */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center opacity-60"
        animate={{
          rotate: [0, 360],
          x: [0, 15, 15, -15, 0],
          y: [0, -15, 15, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
      >
        <div className="w-[300px] sm:w-[400px] md:w-[500px]">
          <Image
            src={notFoundImg}
            alt="Astronaut floating"
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-xl text-center opacity-90">
        <h1 className="text-5xl font-bold text-muted-foreground sm:text-6xl">
          404-error
        </h1>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
          PAGE NOT FOUND
        </h2>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist on Azerishiq.
        </p>
        <Link
          href="/service"
          className="mt-6 inline-block rounded-full border border-primary/90 px-6 py-3 text-lg transition-all hover:bg-primary/90 hover:text-secondary"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}
