"use client";
import { useSidebar } from "@/components/ui/sidebar";
import SubscriberDataTable from "./SubscriberDataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { UserCheck2Icon } from "lucide-react";

export default function SubscriberFeed() {
  const { open } = useSidebar();
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`mx-auto w-full space-y-4 px-2 transition-all duration-300 ${
        open ? "max-w-[1100px]" : "max-w-full px-6"
      } `}
    >
      <motion.div variants={fadeIn("down", "spring", 0.2, 0.8)}>
        <div className="flex w-full items-center justify-between pr-4 pl-3">
          <Button variant={"ghost"} className="text-2xl font-bold items-center hover:bg-secondary"><UserCheck2Icon size={30} className="mr-2 text-primary"/> Subscribers</Button>
          <Link href={"/subscriber/add"}>
            <Button className="h-12 w-full max-w-44 rounded-xl border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary">
              Add subcriber
            </Button>
          </Link>
        </div>
      </motion.div>
      <SubscriberDataTable />
    </motion.div>
  );
}
