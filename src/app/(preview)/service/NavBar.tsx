"use client";
import { navVariants } from "@/lib/motion";
import styles from "@/lib/styles";
import { motion } from "framer-motion";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10">
      <motion.nav
        variants={navVariants}
        initial="hidden"
        whileInView="show"
        className={`${styles.xPaddings} relative bg-secondary py-6`}
      >
        <div
          className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}
        >
          <div className="flex items-start justify-center gap-2">
            <img
              src="/assets/withoutBGAzerisiq.png"
              alt="Logo"
              className={`h-[34px] w-[34px] object-contain`}
            />
            <h2 className="text-[24px] font-semibold leading-[30px] text-foreground">
              Azerishiq ASC
            </h2>
          </div>
          <div className="flex items-center justify-center gap-6">
            {[
              { href: "/service", label: "Servis" },
              { href: "/about-us", label: "Haqqımızda" },
              { href: "/developers", label: "Mühəndislər" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative text-lg font-medium text-foreground transition-colors duration-200 hover:text-primary"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-[24px] font-semibold leading-[30px] text-foreground opacity-0">
              Azerishiq ASC
            </h2>
            <Menu size={30} />

            {theme === "dark" ? (
              <div
                onClick={() => setTheme("light")}
                className="cursor-pointer rounded-full bg-card p-3 text-foreground transition-colors hover:text-primary"
              >
                <Sun size={20} />
              </div>
            ) : (
              <div
                onClick={() => setTheme("dark")}
                className="cursor-pointer rounded-full bg-card p-3 text-foreground transition-colors hover:text-primary"
              >
                <Moon size={20} />
              </div>
            )}
          </div>
        </div>
      </motion.nav>
    </header>
  );
}
