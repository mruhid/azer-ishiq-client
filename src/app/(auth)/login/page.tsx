import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import Logo from "@/assets/authLogo.jpg"
export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen  items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[30rem] overflow-hidden rounded-2xl   bg-card/50 backdrop-blur-md shadow-2xl">
        <div className="w-full  space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Login to Azerishiq</h1>
          <div className="space-y-5">
            <LoginForm/>
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        
      </div>
    </main>
  );
}