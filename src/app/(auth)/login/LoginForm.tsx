"use client";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import LImgae from "@/assets/updateGif.gif";
import CountdownTimer from "./CountdownTimer";

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
      const { success, error, id, roles } = await login(values);
      if (error) {
        setError(error);
        if (error.split(" ")[0] == "OTP") {
          router.push(`/verify?email=${values.email}`);
        }
        toast({
          title: error,
        });
      } else if (success) {
        toast({
          title: "Welcome back",
          description: "Good to see you again on AzerIshiq",
        });
        const url =
          roles?.length === 1 && roles[0].toLowerCase() === "user"
            ? `/user-account/me`
            : `/`;
        router.push(url);
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto w-full max-w-md rounded-lg p-6"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-3"
        >
          {error &&
            (error.split(".")[0] === "Account locked" ? (
              <>
                <div className="text-center text-destructive"> {error}</div>

                <CountdownTimer
                  time={Number(error.split("after")[1].split(" ")[1]) * 60}
                />
              </>
            ) : (
              <motion.p
                className="text-center text-destructive"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            ))}

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                    autoComplete="off"
                  />
                </FormControl>
                <AnimatePresence>
                  {fieldState.invalid && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormMessage />
                    </motion.div>
                  )}
                </AnimatePresence>{" "}
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
                    placeholder="Password"
                    {...field}
                    className="rounded-full border border-muted-foreground/50 bg-secondary py-6"
                  />
                </FormControl>
                <AnimatePresence>
                  {fieldState.invalid && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormMessage />
                    </motion.div>
                  )}
                </AnimatePresence>
              </FormItem>
            )}
          />

          <ForgotPasswordDialog email={form.getValues("email")} />
          <motion.div whileTap={{ scale: 0.95 }}>
            <LoadingButton
              loading={isPending}
              type="submit"
              className="w-full rounded-full bg-primary py-6 transition-all hover:bg-primary/70"
            >
              Log in
            </LoadingButton>
          </motion.div>

          {/* Loading Overlay Effect */}
          <AnimatePresence>
            {isPending && (
              <motion.div
                className="fixed inset-0 hidden h-screen items-center justify-center backdrop-blur-sm md:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex flex-col items-center rounded-full bg-muted-foreground/60"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Image
                    src={LImgae}
                    className="rounded-full"
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
          variant: "destructive",
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
          <strong className="cursor-pointer text-sm transition-all hover:text-primary hover:underline">
            Forgot password
          </strong>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] rounded-2xl border border-muted-foreground/40 bg-card/60 shadow-lg backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter your email to reset your password.</DialogTitle>
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
            className="rounded-xl border border-muted-foreground"
          >
            Send link
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
