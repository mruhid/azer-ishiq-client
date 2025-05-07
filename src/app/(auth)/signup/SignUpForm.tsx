"use client";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "./action";
import { motion, AnimatePresence } from "framer-motion";
import LImgae from "@/assets/updateGif.gif";
import Image from "next/image";

export default function SignUpForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      number: "",
      email: "",
      username: "",
      password: "",
      confirmingPassword: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { success, error } = await signUp(values);
      if (error) {
        setError(error);
      } else if (success) {
        toast({
          title: "Register succesfully",
          description: "Check your new  acount on Login page",
        });
        router.push("/");
      }
    });
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-md rounded-lg p-6"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    autoComplete="off"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    placeholder="Number"
                    type="number"
                    {...field}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmingPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                {fieldState.invalid && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormMessage />
                  </motion.div>
                )}{" "}
              </FormItem>
            )}
          />
          <motion.div whileTap={{ scale: 0.95 }}>
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-full bg-primary py-6 transition-all hover:bg-primary/70"
            >
              Create account
            </LoadingButton>
          </motion.div>

          {/* Loading Overlay Effect */}
          <AnimatePresence>
            {isPending && (
              <motion.div
                className="fixed inset-0 flex h-screen items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex flex-col items-center rounded-lg bg-muted-foreground/60"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Image
                    src={LImgae}
                    className="rounded-2xl"
                    alt="Loading"
                    width={400}
                    height={400}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </motion.div>
  );
}
