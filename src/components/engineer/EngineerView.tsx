import Image from "next/image";
import Developer from "./Developer";
import { developersInfo } from "./developersInfo";
export default function EngineerView({ lang }: { lang?: string }) {
  return (
    <div className="mx-auto rounded-xl bg-orange-500">
      {developersInfo[!lang ? 0 : 1].map((info, i) => (
        <Developer key={i} {...info} />
      ))}
    </div>
  );
}
