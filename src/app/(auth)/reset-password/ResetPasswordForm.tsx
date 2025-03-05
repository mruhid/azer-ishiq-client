"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/PasswordInput";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/LoadingButton";
import { useRouter } from "next/navigation";
import { resetPassword } from "./action";

export default function ResetPasswordForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmingPassword: "",
      password: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setError(undefined);
    startTransition(async () => {
      const { success, error } = await resetPassword(values);
      if (error) {
        setError(error);
        return;
      }
      toast({
        title: "Try you new password",
        description: "Check your password on login pagw",
      });
      router.push("/login");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                  autoComplete="off"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmingPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                  autoComplete="off"
                  placeholder="Confrim password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={isPending}
          type="submit"
          className="w-full rounded-full bg-primary py-6 transition-all hover:bg-primary/70"
        >
          Reset
        </LoadingButton>
      </form>
    </Form>
  );
}
