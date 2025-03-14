"use client";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import { navVariants, textVariant } from "@/lib/motion";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      whileInView="show"
      className="sticky top-0 z-10 border-b border-primary/20 bg-card shadow-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <motion.div variants={textVariant(1.1)} className="flex items-center justify-center p-2 gap-x-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            AzerIshiq
          </Link>
          <SearchField />
        </motion.div>

        <UserButton className="sm:ms-auto" />
      </div>
    </motion.header>
  );
}
