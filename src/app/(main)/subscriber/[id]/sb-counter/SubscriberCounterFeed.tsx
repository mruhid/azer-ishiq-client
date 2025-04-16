"use client";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Subscriber } from "@/lib/type";
import {
  FileScan,
  ReceiptText,
  Unplug,
  UserCheckIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import sbCounterApply from "./action";
import SubscriberStatusBar from "../SubscriberStatusBar";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/motion";

export type CounterValuesProps = {
  number: string;
  stampCode: string;
  coefficient: null | number;
  volt: string;
  type: string;
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
  });
  async function onSubmit() {
    if (
      !counterValues.number.trim() ||
      !counterValues.stampCode.trim() ||
      !counterValues.coefficient ||
      !counterValues.volt.trim() ||
      !counterValues.type.trim()
    ) {
      toast({
        title: "Invalid data",
        description: "Please fill every input",
        variant: "destructive",
      });
      return;
    }
    const newValues = {
      id: subscriber.id,
      credentials: counterValues,
    };
    startTransition(async () => {
      const { success, error } = await sbCounterApply(newValues);
      if (error) {
        toast({
          title: "Something went wrong",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "Subscriber counter creating successfully",
        });
        router.push(`/subscriber/${subscriber.id}/sb-tm`);
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
      {/* <SubscriberStatus id={subscriber.id} /> */}

      <SubscriberStatusBar id={subscriber.id} status={Number(subscriber.status)+1} />

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 1.5)}
        className="mx-auto flex mt-2 flex-col items-start justify-center gap-y-2 rounded-xl border border-muted-foreground/60 bg-card p-2 shadow-md"
      >
        <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-start justify-center gap-2 lg:flex-nowrap lg:justify-between">
          <div className="flex flex-col items-start justify-start gap-y-1">
            <p className="text-sm font-bold">Number</p>
            <Input
              className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
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
              className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
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
          <div className="flex flex-col items-start justify-start gap-y-1">
            <p className="text-sm font-bold">Coefficient </p>
            <Input
              type="number"
              className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
              placeholder="Write coefficient"
              value={counterValues.coefficient || ""}
              onChange={(e) =>
                setCounterValues((prev) => ({
                  ...prev,
                  coefficient: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-1">
            <p className="text-sm font-bold">Volt size</p>
            <Input
              className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
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
          <div className="flex flex-col items-start justify-start gap-y-1">
            <p className="text-sm font-bold">Counter type</p>
            <Input
              className="w-40 rounded-sm border border-muted-foreground bg-secondary shadow-sm"
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
        </div>
        <div className="mx-auto flex w-full flex-wrap items-start justify-center gap-2 lg:flex-nowrap">
          <LoadingButton
            loading={isPending}
            onClick={onSubmit}
            disabled={Number(subscriber.status)>2}
            className="mt-4 w-full max-w-[900px] rounded-sm border border-transparent bg-primary capitalize text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
          >
            Apply
          </LoadingButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

type listProps = {
  name: string;
  src: string;
  icon: React.ElementType;
  color: string;
};
export function SubscriberStatus({ id }: { id: number }) {
  const status = 4;
  const list: listProps[] = [
    {
      name: "Application acceptance",
      src: "/subscriber",
      color: "bg-green-800",
      icon: ReceiptText,
    },
    {
      name: "Generate code",
      color: "bg-green-700",
      src: `/subscriber/${id}/code-for-subscriber`,
      icon: FileScan,
    },
    {
      name: "Electric meter",
      color: "bg-green-500",
      src: `/subscriber/${id}/sb-counter`,
      icon: Zap,
    },
    {
      name: "TM connection",
      color: "bg-gray-300",
      src: `/subscriber/${id}/sb-tm`,
      icon: Unplug,
    },
    {
      name: "The contract",
      color: "bg-gray-300",
      src: "/",
      icon: UserCheckIcon,
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {list.map((item, index) =>
        index + 1 < status ? (
          <Link
            href={item.src}
            key={index}
            className={`flex w-full flex-col items-center justify-center p-1 ${item.color} ${index + 1 < status ? `cursor-pointer` : `cursor-not-allowed`} rounded-sm shadow-md`}
          >
            <div className="flex items-center justify-center rounded-full bg-white p-1">
              <item.icon size={32} className="text-black" />
            </div>
            <p
              className={`mt-2 text-center text-sm font-bold ${index + 1 < status ? `text-white` : `text-black`}`}
            >
              {item.name}
            </p>
          </Link>
        ) : (
          <div
            key={index}
            className={`flex w-full flex-col items-center justify-center p-1 ${item.color} ${index + 1 < status ? `cursor-pointer` : `cursor-not-allowed`} rounded-sm shadow-md`}
          >
            <div className="flex items-center justify-center rounded-full bg-white p-1">
              <item.icon size={32} className="text-black" />
            </div>
            <p
              className={`mt-2 text-center text-sm font-bold ${index + 1 < status ? `text-white` : `text-black`}`}
            >
              {item.name}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
