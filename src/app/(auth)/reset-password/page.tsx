import { Metadata } from "next";
import Image from "next/image";
import Logo from "@/assets/login-image.jpg";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function Page() {
 
  return (
    <main className="flex h-screen items-center justify-center bg-secondary p-5 shadow-sm">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">Reset password</h1>
          
          <div className="space-y-5">
            <ResetPasswordForm />
          </div>
        </div>
        <Image
          src={Logo}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
