import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[31rem] overflow-hidden rounded-2xl bg-card/50 shadow-2xl backdrop-blur-md">
        <div className="w-full space-y-10 overflow-y-auto p-10 py-6">
          <h1 className="text-center text-3xl font-bold">
            Sign up to AzerIshiq
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
