import { Lightbulb } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Electricity portal",
};
export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Lightbulb className="h-10 w-10 text-yellow-500" />
          <h1 className="text-3xl font-bold">Elektron işıq portalı (UGAT)</h1>
        </div>

        <p className="mb-4 text-lg text-muted-foreground">
          UGAT — Elektron işıq portalıdır və "Azərişıq" ASC tərəfindən təqdim
          olunur. Bu portal vətəndaşlara elektrik enerjisi ilə bağlı xidmətlərə
          rahat şəkildə çıxış imkanı yaradır.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">Portalın imkanları:</h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Elektrik enerjisi üçün yeni müraciətlər göndərmək</li>
          <li>Borcları və ödəniş tarixçəsini izləmək</li>
          <li>Yeni obyekt üçün bağlantı sifariş etmək</li>
          <li>Onlayn kabinetə daxil olub müqavilələrə baxmaq</li>
        </ul>

        <h2 className="mb-2 mt-6 text-xl font-semibold">İstifadə qaydası:</h2>
        <p className="mb-4 text-muted-foreground">
          Sistemdən istifadə etmək üçün şəxsiyyət vəsiqəsi və ya ASAN Login ilə
          giriş etmək mümkündür. Xidmət növünü seçərək onlayn müraciət edə
          bilərsiniz.
        </p>

        <h2 className="mb-2 mt-6 text-xl font-semibold">Rəsmi keçid:</h2>
        <a
          href="https://eservice.azerishiq.az/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          eservice.azerishiq.az
        </a>

        <div className="mt-8">
          <Link href="/service">
            <span className="text-muted-foreground hover:underline">
              &larr; Xidmətlərə qayıt
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
