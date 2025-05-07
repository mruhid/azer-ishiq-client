import AboutLayout from "@/components/about/AboutLayout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Us",
};

export default function Page() {
  return <AboutLayout />;
}
