"use client";
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
import SubscriberStatusBar from "../SubscriberStatusBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideIn, staggerContainer } from "@/lib/motion";
import { TypingText } from "@/components/TextEffects";
import sbContractApply from "./action";
import { useQueryClient } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";

export default function SubscriberContractFeed({
  subscriber,
}: {
  subscriber: Subscriber;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const contractText = `This Electricity Service Agreement (the "Agreement") is made and entered into between Azerişıq OJSC ("Provider") and the subscriber ("${subscriber.name} ${subscriber.surname}") identified in this contract. By accepting this contract, the Customer agrees to the following terms:
  
  1. **Service Provision:** The Provider agrees to supply electricity to the Customer’s premises based on the approved application.
  2. **Billing & Payments:** The Customer shall pay for electricity based on metered consumption, billed monthly. Late payments may result in service interruption.
  3. **Usage & Compliance:** The Customer agrees to use electricity responsibly and comply with all regulatory guidelines.
  4. **Termination & Disconnection:** Failure to comply with payment obligations or unauthorized modifications to the meter may result in service termination.
  5. **Liability:** The Provider shall not be liable for power outages caused by natural disasters, maintenance, or unforeseen incidents beyond its control.
  
  By clicking 'Accept & Proceed', the Customer acknowledges reading, understanding, and agreeing to the terms of this contract.
  `;

  async function onSubmit() {
    startTransition(async () => {
      const { success, error } = await sbContractApply(subscriber.id);
      if (error) {
        toast({
          title: "Something went wrong",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        await queryClient.invalidateQueries({
          queryKey: ["subscriber-table-feed"],
        });
        toast({
          title: "Successful Operation",
          description: "Subscriber contract accepting is successfully",
        });
        router.push(`/subscriber`);
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
      <SubscriberStatusBar id={subscriber.id} status={5} />
      <motion.div variants={fadeIn("up", "spring", 0.2, 1.5)}>
        <Card
          className={`mx-auto mt-2 w-full border-muted-foreground/60 bg-card shadow-md transition-all`}
        >
          <CardHeader>
            <CardTitle>Electricity Service Agreement</CardTitle>
            <CardDescription>
              <TypingText
                title={
                  " Read the terms of the contract and complete the last step"
                }
                textStyle="text-center"
              />
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            {!isExpanded ? (
              <Button variant={'ghost'}  className="w-full border border-muted-foreground/50" onClick={() => setIsExpanded(true)}>
                Read Agreement
              </Button>
            ) : null}

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <ScrollArea className="h-64  border p-2 text-start text-sm text-muted-foreground">
                    <pre className="whitespace-pre-wrap">{contractText}</pre>
                  </ScrollArea>
                  <div className="items-top mt-4 flex space-x-2 text-start">
                    <Checkbox
                      id="terms1"
                      checked={isChecked}
                      onCheckedChange={() => setIsChecked(!isChecked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accept terms and conditions
                      </label>
                      <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </div>
                  <LoadingButton
                    loading={isPending}
                    className="mt-4 w-full border border-transparent bg-primary text-white transition-all duration-300 hover:scale-100 hover:border-muted-foreground/70 hover:bg-secondary hover:text-primary"
                    onClick={onSubmit}
                    disabled={isPending || !isChecked || subscriber.status==5}
                  >
                    Accept & Proceed
                  </LoadingButton>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
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
