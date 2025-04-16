"use client";
import { fadeIn, staggerContainer } from "@/lib/motion";
import SubstationDataTable from "./SubstationsDataTable";
import SubstationSelect from "./SubstationSelect";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2Icon } from "lucide-react";

export default function SubstationFeed() {
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="mx-2 flex flex-col items-center justify-center gap-y-3 px-2 py-2"
    >
      <motion.div 
      className="w-full"
      variants={fadeIn("down", "spring", 0.2, 0.8)}>
        <div className="flex w-full items-center justify-between pr-2">
          <Button
            variant={"ghost"}
            className="items-center text-2xl font-bold hover:bg-secondary"
          >
            <Building2Icon size={30} className="mr-2 text-primary" />{" "}
            Subscribers
          </Button>
          <Link href={"/substations/add"}>
            <Button className="h-12 w-full max-w-44 rounded-xl border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary">
              Add substations
            </Button>
          </Link>
        </div>
      </motion.div>
      <SubstationSelect />
      <SubstationDataTable />
    </motion.div>
  );
}
