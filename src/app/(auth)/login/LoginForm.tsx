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
import { forgotPassword, login } from "./action";
import { PasswordInput } from "@/components/PasswordInput";
import { loginSchema, LoginValues } from "@/lib/validation";
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

export default function LoginForm() {
  const [error, setError] = useState<string>();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    startTransition(async () => {
      const { success, error } = await login(values);
      if (error) {
        setError(error);
      } else if (success) {
        toast({
          title: "Welcome back",
          description: "Good to see you agin on AzerIshiq",
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                  autoComplete="off"
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
                  placeholder="Password"
                  {...field}
                  className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ForgotPasswordDialog email={form.getValues("email")} />
        <LoadingButton loading={isPending} type="submit" className="w-full rounded-full py-6 bg-primary hover:bg-primary/70 transition-all">
          Log in
        </LoadingButton>
      </form>
    </Form>
  );
}

export function ForgotPasswordDialog({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const [forggotenEmail, setForggottenEmail] = useState<string>(email);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setForggottenEmail(email);
    }
  }, [email, isOpen]);
  

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForggottenEmail(event.target.value);
  };

  const onSubmit = async () => {
    startTransition(async () => {
      const result = await forgotPassword(forggotenEmail);

      if (result.error) {
        toast({
          title: "Unsuccessful operation",
          description: result.error,
          className: "bg-destructive",
        });
      } else {
        toast({
          title: "Successful operation",
          description:
            "The reset link has been successfully sent to your email address.",
        });
      }
    setIsOpen(false);

    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="mr-2 flex items-center justify-end">
          <strong className="cursor-pointer text-sm text-muted-foreground/40 transition-all hover:text-primary hover:underline">
            Forgot password
          </strong>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border border-muted-foreground/40 bg-card/80 shadow-lg  backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot password</DialogTitle>
          <DialogDescription>
            Enter your email to reset your password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input
              id="email"
              autoCapitalize="off"
              onChange={handleEmailChange}
              value={forggotenEmail}
              placeholder="Email"
              className="col-span-3 rounded-xl bg-secondary/40"
            />
          </div>
        </div>
        <DialogFooter>
          <LoadingButton
            loading={isPending}
            onClick={onSubmit}
            disabled={!forggotenEmail}
            variant={'outline'}
            className="rounded-xl border border-muted-foreground"
          >
            Send link
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
