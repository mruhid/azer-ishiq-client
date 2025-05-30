import { Metadata } from "next";
import VerifyForm from "./VerifyForm";
export const metadata: Metadata = {
  title: "Verify",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center bg-foreground/10 px-2 py-5">
      <div className="flex h-full max-h-[22rem] w-full max-w-[30rem] overflow-hidden rounded-2xl border border-muted-foreground/70 bg-card/60 shadow-2xl backdrop-blur-md">
        <div className="w-full overflow-y-auto p-10">
          <h1 className="bg-gradient-to-r from-blue-400 via-primary to-purple-900 bg-clip-text text-center text-3xl font-bold text-transparent">
            Verify
          </h1>
          <p className="mb-4 text-center">You code was sent to you via email</p>
          <div className="space-y-5">
            <VerifyForm />
          </div>
        </div>
      </div>
    </main>
  );
}
