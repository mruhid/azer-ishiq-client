"use client";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import { navVariants, textVariant } from "@/lib/motion";
import { motion } from "framer-motion";
import { NavMenu } from "./NavMenu";
import { MenuIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  return (
    <>
      {" "}
      <motion.header
        variants={navVariants}
        initial="hidden"
        whileInView="show"
        className="sticky top-0 z-10 mr-6  w-full bg-secondary border-0 shadow-none"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-x-5 px-4 py-1">
          <motion.div
            variants={textVariant(1.1)}
            className="mt-2 flex w-full items-center justify-between gap-x-4 py-2 pl-2 pr-12 lg:pr-0"
          >
            <MenuIcon size={35} onClick={toggleSidebar} />
            <Link href="/" className="text-2xl font-bold text-primary">
              AzerIshiq
            </Link>
            <div className="hidden lg:flex">
              <NavMenu />
            </div>
            <div className="flex items-center justify-center sm:ms-auto">
              <SearchField />
              <UserButton className="ml-4" />
            </div>
          </motion.div>
          <div className="hidden sm:flex lg:hidden">
            <NavMenu />
          </div>
        </div>
      </motion.header>
    </>
  );
}
