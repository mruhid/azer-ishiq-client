"use client";
import { navVariants } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
import {  Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import SideMenuBar from "../SideMenuBar";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useSession();
  const role = user?.roles.some((f) => f.toLowerCase() === "admin");

  return (
    <header className="sticky top-0 z-10">
      <motion.nav
        variants={navVariants}
        initial="hidden"
        whileInView="show"
        className={`${styles.xPaddings} relative bg-secondary py-6`}
      >
        <div
          className={`${styles.innerWidth} mx-auto flex flex-wrap items-center justify-between gap-8`}
        >
          <div className="flex items-center gap-2">
            <img
              src="/assets/withoutBGAzerisiq.png"
              alt="Logo"
              className="h-[34px] w-[34px] object-contain"
            />
            <Link href="/service">
              <h2 className="text-[24px] font-semibold text-foreground">
                Azerishiq ASC
              </h2>
            </Link>
          </div>

          <nav className="hidden lg:flex flex-wrap items-center gap-6">
            {[
              { href: "/service", label: "Xidmətlər" },
              { href: "/about-us", label: "Haqqımızda" },
              { href: "/developers", label: "Mühəndislər" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="group relative text-lg font-medium text-foreground transition-colors hover:text-primary"
              >
                {label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Theme and Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Conditionally show Dashboard button */}
            {user && role && (
              <Button className="border" asChild variant="ghost">
                <Link href="/">
                  {" "}
                  <Settings className="mr-4 transition-transform duration-300 group-hover:rotate-90" />
                  Dashboard
                </Link>
              </Button>
            )}
            <SideMenuBar />

            <div
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer rounded-full bg-card p-3 text-foreground transition-colors hover:text-primary"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </div>
          </div>
        </div>
      </motion.nav>
    </header>
  );
}
