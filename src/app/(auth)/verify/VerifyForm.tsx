"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { otpVerifySchema, OtpVerifyValues } from "@/lib/validation";
import LoadingButton from "@/components/LoadingButton";
import LImgae from "@/assets/robotLoading.gif";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { otpVerify } from "./action";

export default function VerifyForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || undefined;
  console.log(email);

  const [isPending, startTransition] = useTransition();
  const form = useForm<OtpVerifyValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(data: OtpVerifyValues) {
    if (!email) {
      toast({
        title: "Invalid email",
        variant: "destructive",
      });
      return;
    }
    const newValues = {
      email: email,
      otpCode: data.otpCode,
    };
    setError(undefined);
    startTransition(async () => {
      const { success, error } = await otpVerify(newValues);
      if (error) {
        setError(error);
        toast({
          title: "Verify falled",
          description: error,
          variant: "destructive",
        });
      } else if (success) {
        toast({
          title: "Successful Operation",
          description: "Welcome back with new device",
        });
        router.push(`/`);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto space-y-3 text-center"
        >
          {error && (
            <motion.p
              className="text-center text-destructive"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          <FormField
            control={form.control}
            name="otpCode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="mx-auto">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <AnimatePresence>
                  {fieldState.invalid ? (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormMessage />
                    </motion.div>
                  ) : (
                    <div className="opacity-0">Block</div>
                  )}
                </AnimatePresence>{" "}
              </FormItem>
            )}
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-xl border border-primary bg-primary py-6 text-background transition-all hover:border-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              Verify{" "}
            </LoadingButton>
          </motion.div>
          {/* Loading Overlay Effect */}
        </form>
      </Form>
    </motion.div>
  );
}
