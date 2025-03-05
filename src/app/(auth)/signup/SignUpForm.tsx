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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                  placeholder="Username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
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
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          className="w-full rounded-full py-6"
          loading={isPending}
          type="submit"
        >
          Create account
        </LoadingButton>
      </form>
    </Form>
  );
}
