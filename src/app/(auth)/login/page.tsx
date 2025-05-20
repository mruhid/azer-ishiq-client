import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";
export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-[600px] items-center justify-center p-5 md:h-screen">
      <div className="flex h-full max-h-[30rem] w-full max-w-[22rem] overflow-hidden rounded-2xl bg-card/70 shadow-2xl backdrop-blur-md md:max-h-[40rem] md:max-w-[30rem]">
        <div className="w-full overflow-y-auto p-10 md:space-y-10">
          <h1 className="bg-gradient-to-r from-blue-400 via-primary to-purple-900 bg-clip-text text-center text-3xl font-bold text-transparent">
            Login to Azerishiq
          </h1>
          <div className="space-y-5 w-full">
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
