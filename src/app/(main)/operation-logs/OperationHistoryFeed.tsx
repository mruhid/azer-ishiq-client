"use client";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { UserSearchIcon } from "lucide-react";
import OperationLogsDataTable from "./OperationLogsDataTable";
import { useSidebar } from "@/components/ui/sidebar";

export default function OperationHistoryFeed() {
  const { open } = useSidebar();

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`mx-auto w-full space-y-4 px-4 transition-all duration-300 ${
        open ? "max-w-[1100px]" : "max-w-full px-6"
      }`}
    >
      <motion.div variants={fadeIn("down", "spring", 0.2, 0.8)}>
        <div className="flex w-full items-center justify-between pr-4">
          <Button
            variant={"ghost"}
            className="items-center text-2xl font-bold hover:bg-secondary"
          >
            <UserSearchIcon size={30} className="mr-2 text-primary" /> Operation
            logs
          </Button>
        </div>
      </motion.div>
      <OperationLogsDataTable />
    </motion.div>
  );
}
