import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="my-auto flex h-screen items-center justify-center bg-foreground/10 px-2 py-5">
      <div className="flex h-full max-h-[38rem] w-full max-w-[31rem] overflow-hidden rounded-2xl bg-card/50 shadow-2xl backdrop-blur-md">
        <div className="w-full space-y-10 overflow-y-auto p-10 py-6">
          <h1 className="bg-gradient-to-r from-blue-400 via-primary to-purple-900 bg-clip-text text-center text-3xl font-bold text-transparent">
            Sign up to Azerishiq
          </h1>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
