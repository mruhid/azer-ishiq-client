"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Logo from "@/assets/substationHeroImg.png";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { DebtResponse } from "@/lib/type";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function ElectricityDebtCheck() {
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [subCode, setSubsCode] = useState<string>("");
  const { data, refetch, isPending, isError } = useQuery<DebtResponse>({
    queryKey: ["electricDebt", subCode],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/debt?subscriberCode=${subCode}`,
        {
          method: "GET",
        },
      );
      if (!res.ok) throw new Error("Istifadəçi tapılmadı");
      return res.json();
    },
    enabled: !!subCode,
    staleTime: Infinity,
    retry: false,
  });
  const handleSearch = () => {
    setSubsCode(searchedValue);
    refetch();
  };
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Left Card: Electric Debt Check */}
      <Card className="flex items-center justify-center rounded-xl border-muted-foreground/50 bg-secondary p-6 shadow-xl">
        <CardContent className="w-full space-y-4 p-0">
          <h2 className="text-lg font-semibold">Elektrik borcunu öyrən</h2>
          <div className="flex items-center gap-2">
            <Input
              value={searchedValue}
              onChange={(e) => setSearchedValue(e.target.value)}
              placeholder="Telefon və ya abunə kodu"
              className="bg-card"
            />

            <Select>
              <SelectTrigger className="w-28 bg-card">
                <SelectValue placeholder="Əhali" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="ehali">Əhali</SelectItem>
                <SelectItem value="qeyri-ehali">Qeyri-Əhali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Abonent kodu vasitəsilə" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="abonent">Abonent kodu vasitəsilə</SelectItem>
                <SelectItem value="telefon">Telefon nömrəsi ilə</SelectItem>
              </SelectContent>
            </Select>
            <DeptResponseDialog
              isError={isError}
              isPending={isPending}
              subCode={searchedValue}
              data={data}
              handleSearch={handleSearch}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col items-center justify-between rounded-xl border border-muted-foreground/50 bg-secondary px-2 py-6 shadow-xl">
        <CardContent className="my-4 flex items-center justify-center gap-4 space-y-4">
          <div className="flex flex-col items-start justify-start gap-y-6">
            <p className="text-start font-semibold">
              MTK-ların enerji təchizatı şəbəkələrinə qoşulması barədə məlumat
            </p>
            <Button
              className="w-28 border border-muted-foreground/70 bg-card"
              variant="ghost"
            >
              Ətraflı
            </Button>
          </div>

          <Image
            src={Logo}
            alt="MTK Building"
            width={150}
            height={150}
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function DeptResponseDialog({
  isError,
  isPending,
  data,
  subCode,
  handleSearch,
}: {
  isError: boolean;
  subCode: string;
  isPending: boolean;
  data: DebtResponse | undefined;
  handleSearch: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleSearch}
          disabled={!subCode.trim()}
          className="w-28 bg-[#4C43CD] text-white hover:bg-[#3d36aa]"
        >
          Yoxla
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl border border-muted-foreground bg-secondary text-xl sm:max-w-[425px]">
        <DialogTitle className="text-center">
          Elektrik borcunu öyrən
        </DialogTitle>

        <DialogDescription>
          <div className="my-2 h-px w-full bg-foreground/40" />
        </DialogDescription>

        <div className="mx-auto flex w-full flex-col gap-y-3 p-4 text-foreground">
          {isPending && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Yüklənir...</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-red-600">
              <AlertTriangle size={20} />
              Abonent kodu yalnışdır və ya mövcud deyil.
            </div>
          )}

          {data && !isError && !isPending && (
            <>
              <Row label="Kod:" value={data.subscriberCode} />
              <Row
                label="Adı, soyadı:"
                value={`${data.name} ${data.surname}`}
              />
              <Row label="Rayon:" value={`${data.districtName}`} />
              <Row label="Son göstərici:" value={data.totalCurrentValue} />
              <Row
                label="Borc:"
                value={`${data.debt} AZN`}
                valueClass="text-red-600 font-semibold"
              />
              <Button className="h-14 w-full rounded-lg bg-primary transition-all duration-300 hover:bg-primary/70">
                Ödəniş et
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) {
  return (
    <div className="grid w-full grid-cols-2 text-[17px] capitalize">
      <p className="font-medium text-muted-foreground">{label}</p>
      <p className={`pl-3 font-medium ${valueClass}`}>{value}</p>
    </div>
  );
}
