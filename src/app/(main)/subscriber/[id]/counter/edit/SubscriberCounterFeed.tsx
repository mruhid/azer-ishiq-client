"use client";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Subscriber } from "@/lib/type";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import sbCounterUpdate from "./action";

export type CounterValuesProps = {
  number: string;
  stampCode: string;
  coefficient: null | number;
  volt: string;
  type: string;
  phase: number | null;
};
export default function SubscriberCounterFeed({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [counterValues, setCounterValues] = useState<CounterValuesProps>({
    number: "",
    stampCode: "",
    coefficient: null,
    volt: "",
    type: "",
    phase: null,
  });
  async function onSubmit() {
    if (
      !counterValues.number.trim() ||
      !counterValues.stampCode.trim() ||
      !counterValues.coefficient ||
      !counterValues.volt.trim() ||
      !counterValues.type.trim() ||
      !counterValues.phase
    ) {
      toast({
        title: "Invalid data",
        description: "Please fill every fields",
        variant: "destructive",
      });
      return;
    }
    const newValues = {
      id: subscriber.id,
      credentials: counterValues,
    };
    startTransition(async () => {
      const { success, error } = await sbCounterUpdate(newValues);
      if (error) {
        toast({
          title: "Something went wrong",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "Subscriber counter updated successfully",
        });
        router.push(`/subscriber/`);
      }
    });
  }
  return (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="mx-2"
    >
      <motion.div
        variants={fadeIn("up", "spring", 0.2, 1.5)}
        className="mx-auto mt-2 flex flex-col items-start justify-center gap-y-2 rounded-xl border border-muted-foreground/60 bg-card p-2 shadow-md"
      >
        <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-start justify-center gap-2 lg:flex-nowrap lg:justify-between">
          <div className="flex flex-col items-start justify-start gap-y-2">
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Number</p>
              <Input
                className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
                placeholder="01234567"
                value={counterValues.number || ""}
                onChange={(e) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    number: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Stamp Code</p>
              <Input
                className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
                placeholder="111-222-333"
                value={counterValues.stampCode || ""}
                onChange={(e) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    stampCode: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Coefficient</p>
              <Select
                value={String(counterValues.coefficient || "")}
                onValueChange={(value) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    coefficient: Number(value),
                  }))
                }
              >
                <SelectTrigger className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
                  <SelectValue placeholder="Select coefficient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 kVt-dan yuxarı</SelectItem>
                  <SelectItem value="100">200 kVt-a qədər</SelectItem>
                  <SelectItem value="50">Orta gərginlik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Volt size</p>
              <Input
                className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
                placeholder="120V"
                value={String(counterValues.volt) || ""}
                onChange={(e) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    volt: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-y-2">
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Counter type</p>
              <Input
                className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
                placeholder="Write type"
                value={String(counterValues.type) || ""}
                onChange={(e) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p className="text-sm font-bold">Phase</p>
              <Select
                value={String(counterValues.phase || "")}
                onValueChange={(value) =>
                  setCounterValues((prev) => ({
                    ...prev,
                    phase: Number(value),
                  }))
                }
              >
                <SelectTrigger className="w-48 rounded-sm border border-muted-foreground bg-secondary shadow-sm">
                  <SelectValue placeholder="Select Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 phase</SelectItem>
                  <SelectItem value="3">3 phase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-wrap items-start justify-center gap-2 lg:flex-nowrap">
          <LoadingButton
            loading={isPending}
            onClick={onSubmit}
            className="mt-4 w-full max-w-[900px] rounded-sm border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
          >
            Update
          </LoadingButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
