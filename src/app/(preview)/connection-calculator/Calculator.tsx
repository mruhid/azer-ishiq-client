"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorIcon } from "lucide-react";
import { FormEvent, useState } from "react";

export default function Calculator() {
  const [power, setPower] = useState("");
  const [cost, setCost] = useState<string | null>(null);

  const handleCalculate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const kw = parseFloat(power);
    if (isNaN(kw) || kw <= 0) {
      setCost("Zəhmət olmasa düzgün enerji dəyəri daxil edin.");
      return;
    }

    // Example formula: 1 kVt = 80 AZN (you can change the value)
    const estimatedCost = kw * 80;
    setCost(`Təxmini qoşulma haqqı: ${estimatedCost.toFixed(2)} AZN`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <CalculatorIcon className="h-10 w-10 text-blue-600" />
        <h1 className="text-3xl font-bold">Qoşulma kalkulyatoru</h1>
      </div>

      <p className="mb-6 text-lg text-muted-foreground">
        Elektrik şəbəkəsinə qoşulma üçün lazım olan xərcləri təxmini hesablamaq
        üçün enerji tələbatınızı daxil edin.
      </p>

      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <Label
            htmlFor="power"
            className="mb-1 block font-medium text-primary-foreground"
          >
            Enerji tələbatı (kVt ilə):
          </Label>
          <Input
            type="number"
            id="power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className="borderborder w-full rounded-md border-muted-foreground/30 bg-card px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Məsələn: 5"
            step="0.1"
            min="0"
          />
        </div>
        <Button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          Hesabla
        </Button>
      </form>

      <div
        className={`${cost ? "opacity-100" : "opacity-0"} mt-6 text-lg font-medium text-green-600`}
      >
        {cost}
      </div>
    </div>
  );
}
