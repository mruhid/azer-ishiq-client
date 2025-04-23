"use client";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/motion";
import { motion } from "framer-motion";
import { SearchCheck, UserSearchIcon } from "lucide-react";
import OperationLogsDataTable from "./OperationLogsDataTable";
import { useSidebar } from "@/components/ui/sidebar";
import SearchSubsDialog from "./SearchSubsLogDialog";

export default function OperationHistoryFeed() {
  const { open } = useSidebar();

  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`mx-auto w-full space-y-4 px-4 transition-all duration-300 sm:max-w-full ${
        open
          ? "w-full md:max-w-[500px] lg:max-w-[750px] xl:max-w-[1200px] 2xl:max-w-[1200px]"
          : "px-6 md:max-w-[1300px] lg:max-w-[1300px] xl:max-w-[1300px] 2xl:max-w-[1300px]"
      } `}
    >
      <motion.div variants={fadeIn("down", "spring", 0.2, 0.8)}>
        <div className="flex w-full flex-col items-center justify-center gap-y-2 sm:flex-row sm:justify-between sm:gap-y-0">
          <Button
            variant={"ghost"}
            className="items-center text-2xl font-bold hover:bg-secondary"
          >
            <UserSearchIcon size={30} className="mr-2 text-primary" /> Operation
            logs
          </Button>
          <SearchSubsDialog />
        </div>
      </motion.div>
      <OperationLogsDataTable />
    </motion.div>
  );
}
