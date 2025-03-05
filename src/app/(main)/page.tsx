import Image from "next/image";
import RegionFilter from "./RegionFilter";

export default function Home() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1000px] space-y-5">
      <RegionFilter />
    </div>
  );
}
