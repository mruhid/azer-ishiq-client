import { Metadata } from "next";
import SubscriberFeed from "./SubscriberFeed";

export const metadata: Metadata = {
  title: "Subscribers",
};
export  default  function Page() {
  return (
    <div className=" w-full  min-w-0 space-y-5">
        <SubscriberFeed/>
    </div>
  );
}
