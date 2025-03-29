"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(main)/SessionProvider";
import Image from "next/image";
import SubsImg from "@/assets/substationHeroImg.png";
export default function HeroCards() {
  const { user } = useSession();
  return (
    <div className="flex flex-col  justify-center gap-6 px-6 lg:grid lg:grid-cols-3">
      <Card className="col-span-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <CardHeader>
          <CardTitle>
            Welcome Back, {user ? user.userName : "Unauthorized user"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex flex-col justify-start gap-y-5 py-2">
            <p>Manage your profile efficiently</p>
            <Button className="rounded-xl bg-white text-blue-700 transition-all hover:bg-slate-200">
              See Profile
            </Button>
          </div>

          <Image
            alt="Substation hero"
            src={SubsImg}
            width={170}
            height={170}
            className="aspect-square flex-none object-cover"
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardHeader>
          <CardTitle>Want See Substation Table?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Click for filtering Substation on data table</p>
          <Button className="mt-3 rounded-xl bg-white text-blue-700 transition-all hover:bg-slate-200">
            See Substation
          </Button>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold">1,134 Items</h2>
          <p className="text-green-500">+10% this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold">$4,231</h2>
          <p className="text-red-500">-22% this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h3 className="text-2xl font-bold">$537</h3>
              <p className="text-green-500">Available</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">$234</h3>
              <p className="text-red-500">Pending</p>
            </div>
          </div>
          <Button className="mt-4 w-full bg-blue-600 text-white">Withdraw Money</Button>
        </CardContent>
      </Card> */}
    </div>
  );
}
