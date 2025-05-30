import { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function Page() {
  return (
    <main className="flex h-[600px] items-center justify-center py-5 mx-2 my-auto bg-foreground/10 md:h-screen">
      <div className="flex h-full max-h-[20rem] w-full max-w-[22rem] overflow-hidden rounded-2xl bg-card/70 shadow-2xl backdrop-blur-md md:max-h-[25rem] md:max-w-[30rem]">
        <div className="w-full overflow-y-auto p-10 md:space-y-10">
          <h1 className="bg-gradient-to-r mb-4 from-blue-400 via-primary to-purple-900 bg-clip-text text-center text-3xl font-bold text-transparent">
            Reset password
          </h1>
          <div className="w-full space-y-5">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
