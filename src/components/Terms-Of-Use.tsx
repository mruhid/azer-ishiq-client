"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "./ui/use-toast";
type Lang = "en" | "az";

export default function TermsOfUse({ lang = "en" }: { lang?: Lang }) {
  const repo = {
    client: "https://github.com/mruhid/azer-ishiq-client.git",
    server: "https://github.com/fryzcode/AzerIsiq",
  };

  const translations = {
    en: {
      title: "Terms of Use / Developer Guide",
      backendTitle: ".NET Backend Setup",
      frontendTitle: "Frontend (Next.js) Setup",
      backendRepo: "Backend GitHub Repository",
      frontendRepo: "Frontend GitHub Repository",
      cloneCommand: `git clone ${repo.server}`,
      installDeps: "npm install --legacy-peer-deps",
      runApp: "npm run dev",
      backendSteps: [
        "Clone the backend repository.",
        "Open the project folder in your IDE.",
        "Set up the database and environment variables.",
        "Run the project using Visual Studio or `dotnet run`.",
      ],
      frontendSteps: [
        "Clone the frontend repository.",
        "Navigate into the project folder.",
        "Install the correct dependencies using npm.",
        "Run the app on localhost:3000.",
      ],
      envTitle:
        "Create a .env file and add the following variables. This file should be located directly inside your repository:",
      envVariables: [
        {
          key: "NEXT_PUBLIC_BACKEND_URL",
          value: "http://IP:PORT/api",
          description: "Your backend API base URL (used for all API requests)",
        },
        {
          key: "NEXT_PUBLIC_BACKEND_URL_CHAT",
          value: "http://IP:PORT",
          description:
            "Your backend base URL (used for socket/chat connection)",
        },
        {
          key: "SECRET_KEY",
          value: "YOUR_SECRET_KEY",
          description:
            "A secret key used for encrypting login/registration tokens",
        },
        {
          key: "NEXT_PUBLIC_IMAGE_HOST",
          value: "192.168.137.152",
          description: "Host IP or domain where uploaded images will be served",
        },
      ],
    },
    az: {
      title: "İstifadə Şərtləri / Tərtibatçı Bələdçisi",
      backendTitle: ".NET Backend Qurulumu",
      frontendTitle: "Frontend (Next.js) Qurulumu",
      backendRepo: "Backend GitHub Repozitoriyası",
      frontendRepo: "Frontend GitHub Repozitoriyası",
      cloneCommand: `git clone ${repo.server} `,
      installDeps: "npm install --legacy-peer-deps",
      runApp: "npm run dev",
      backendSteps: [
        "Backend repozitoriyasını klonlayın.",
        "Layihə qovluğunu IDE-də açın.",
        "Məlumat bazası və ətraf mühit dəyişənlərini qurun.",
        "`dotnet run` və ya Visual Studio ilə layihəni başladın.",
      ],
      frontendSteps: [
        "Frontend repozitoriyasını klonlayın.",
        "Layihə qovluğuna daxil olun.",
        "npm ilə uyğun paketləri quraşdırın.",
        "localhost:3000-da tətbiqi başladın.",
      ],
      envTitle:
        ".env faylı yaradın və aşağıdakı dəyişənləri əlavə edin. Bu fayl birbaşa repozitoriyanın içərisində yerləşməlidir:",
      envVariables: [
        {
          key: "NEXT_PUBLIC_BACKEND_URL",
          value: "http://IP:PORT/api",
          description:
            "Backend API əsas URL (bütün sorğular üçün istifadə olunur)",
        },
        {
          key: "NEXT_PUBLIC_BACKEND_URL_CHAT",
          value: "http://IP:PORT",
          description:
            "Backend ünvanı (socket və ya chat üçün istifadə olunur)",
        },
        {
          key: "SECRET_KEY",
          value: "YOUR_SECRET_KEY",
          description:
            "Giriş və qeydiyyat zamanı şifrələmə üçün istifadə edilən gizli açar",
        },
        {
          key: "NEXT_PUBLIC_IMAGE_HOST",
          value: "192.168.137.152",
          description: "Yüklənmiş şəkillərin yerləşdiyi host IP və ya domain",
        },
      ],
    },
  };

  const theme = {
    en: {
      themeGuide: {
        title: "🎨 How to Change Theme Colors",
        description:
          "Follow these steps to customize your app’s color theme using ShadCN UI:",
        steps: [
          "Open the /styles/globals.css file.",
          "Locate the :root CSS block.",
          "Update the CSS variables like so:",
          "For dark mode, locate and update the .dark block:",
          "Save the file — changes will apply automatically.",
        ],
        rootExample: `:root {
  --radius: 0.5rem;
  --primary: #1e40af;
  --primary-foreground: #ffffff;
  --background: #f8fafc;
  --foreground: #0f172a;
}`,
        darkExample: `.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --primary: #38bdf8;
  --primary-foreground: #000000;
}`,
      },
      // ...other translations
    },
    az: {
      themeGuide: {
        title: "🎨 Tema Rənglərini Necə Dəyişmək Olar",
        description:
          "ShadCN UI istifadə edərək tətbiqinizin rəng mövzusunu dəyişmək üçün bu addımları izləyin:",
        steps: [
          "/styles/globals.css faylını açın.",
          ":root CSS blokunu tapın.",
          "CSS dəyişənlərini aşağıdakı kimi dəyişin:",
          "Dark mode üçün .dark blokunu tapın və dəyişin:",
          "Faylı yadda saxlayın – dəyişikliklər avtomatik tətbiq olunacaq.",
        ],
        rootExample: `:root {
  --radius: 0.5rem;
  --primary: #1e40af;
  --primary-foreground: #ffffff;
  --background: #f8fafc;
  --foreground: #0f172a;
}`,
        darkExample: `.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --primary: #38bdf8;
  --primary-foreground: #000000;
}`,
      },
      // ...other translations
    },
  };

  const t = translations[lang];
  const themeByLang = theme[lang].themeGuide;
  const { toast } = useToast();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="mx-auto w-full px-6 py-10 text-muted-foreground">
      <h1 className="mb-8 text-4xl font-bold text-primary">{t.title}</h1>

      {/* BACKEND */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          {t.backendTitle}
        </h2>
        <div className="mb-4 rounded-lg border bg-card p-4">
          <p className="mb-2 font-medium">{t.backendRepo}:</p>
          <div className="flex items-center justify-between rounded-md bg-background p-2">
            <code className="overflow-x-auto text-sm">{t.cloneCommand}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(t.cloneCommand)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="list-inside list-disc space-y-2">
          {t.backendSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </section>

      {/* FRONTEND */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          {t.frontendTitle}
        </h2>
        <div className="mb-4 rounded-lg border bg-card p-4">
          <p className="mb-2 font-medium">{t.frontendRepo}:</p>
          <div className="mb-2 flex items-center justify-between rounded-md bg-background p-2">
            <code className="overflow-x-auto text-sm">
              git clone {repo.client}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(`git clone ${repo.client}`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-2 flex items-center justify-between rounded-md bg-background p-2">
            <code className="text-sm">cd your-frontend-folder</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy("cd your-frontend-folder")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-2 flex items-center justify-between rounded-md bg-background p-2">
            <code className="text-sm">{t.installDeps}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(t.installDeps)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* .env section */}
          <p className="mb-2 mt-4 font-medium">{t.envTitle}</p>
          <div className="mb-2 grid grid-cols-1 gap-y-2 text-sm">
            {t.envVariables.map(({ key, value, description }) => (
              <div
                key={key}
                className="grid grid-cols-2 gap-2 overflow-hidden rounded-md bg-background p-2 md:grid-cols-3"
              >
                <code className="flex items-center overflow-hidden rounded px-2 py-1">{`${key}="${value}"`}</code>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(`${key}="${value}"`)}
                    className="ml-auto md:mx-auto"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <p className="hidden items-center text-xs text-muted-foreground md:flex">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-md bg-background p-2">
            <code className="text-sm">{t.runApp}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(t.runApp)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold text-primary">
            {themeByLang.title}
          </h2>
          <p className="mb-3 text-muted-foreground">
            {themeByLang.description}
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {themeByLang.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
            <li>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-foreground">
                {themeByLang.rootExample}
              </pre>
            </li>
            <li>
              <pre className="mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-foreground">
                {themeByLang.darkExample}
              </pre>
            </li>
          </ol>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-primary">
          {lang == "az" ? "Ümumi baxış" : "Ending view"}
        </h2>

        <ul className="mx-2 mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {t.frontendSteps.map((step, idx) => (
            <li
              className="relative z-0 flex h-14 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-primary text-secondary transition-all duration-300 hover:border-primary hover:bg-secondary hover:text-foreground"
              key={idx}
            >
              <div className="absolute -left-4 z-10 flex size-14 items-center justify-center rounded-full border border-muted-foreground bg-card text-foreground">
                <p className="text-xl">{idx + 1}</p>
              </div>
              <p className="text-lg font-semibold">{step}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
