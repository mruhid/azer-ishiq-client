import { Metadata } from "next";
import Calculator from "./Calculator";
export const metadata: Metadata = {
  title: "Connection calculator",
};
export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <Calculator />
    </main>
  );
}
