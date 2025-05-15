import Frontend from "@/assets/client-developer.jpg";
import Backend from "@/assets/server-developer.png";
import { StaticImageData } from "next/image";

interface DeveloperInfo {
  title: string;
  developerUrl: StaticImageData;
  fullname: string;
  me: string;
  job: string;
  jobDescription: string;
  toolTitle: string;
  tools: string;
  responsiblityTitle: string;
  responsiblityDescription: string;
}

export const developersInfo: DeveloperInfo[][] = [
  [
    {
      title: "Backend Developer",
      developerUrl: Backend,
      fullname: "Faryaz Hacimuradov",
      me: "I specialize in building secure and efficient backend systems, APIs, and database structures.",
      job: "Software Engineer (Backend)",
      jobDescription:
        "Developing robust backend services using C# and .NET technologies, ensuring scalability and maintainability.",
      toolTitle: "Backend Tools",
      tools:
        "C#, .NET Core, Entity Framework, MsSql,, Dapper ,Docker, REST APIs",
      responsiblityTitle: "Responsibilities",
      responsiblityDescription:
        "Design and maintain APIs, integrate with frontend, optimize database performance, and handle application logic.",
    },
    {
      title: "Frontend Developer",
      developerUrl: Frontend,
      fullname: "Ruhid Mammadzade",
      me: "I am a passionate frontend developer who focuses on building responsive and user-friendly web applications.",
      job: "Web Interface Engineer",
      jobDescription:
        "Building performant UI interfaces using modern frameworks like Next.js and maintaining scalable front-end architecture.",
      toolTitle: "UI Tools",
      tools: "React Query, Next.js, ShadCN, Tailwind CSS, TypeScript",
      responsiblityTitle: "Responsibilities",
      responsiblityDescription:
        "Translate designs into code, collaborate with backend teams, ensure accessibility and performance optimizations.",
    },
  ],
  [
    {
      title: "Backend Tərtibatçısı",
      developerUrl: Backend,
      fullname: "Faryaz Hacımuradov",
      me: "Mən təhlükəsiz və səmərəli backend sistemləri, API-lər və verilənlər bazası strukturları qurmağa ixtisaslaşmışam.",
      job: "Proqram Təminatı Mühəndisi (Backend)",
      jobDescription:
        ".NET və C# texnologiyalarından istifadə edərək genişlənə bilən və saxlanılması asan backend xidmətləri hazırlayıram.",
      toolTitle: "Backend Alətləri",
      tools:
        "C#, .NET Core, Entity Framework, MsSQL, Dapper ,Docker, REST API-lər,",
      responsiblityTitle: "Öhdəliklər",
      responsiblityDescription:
        "API-lərin hazırlanması və saxlanılması, frontend ilə inteqrasiya, verilənlər bazası performansının optimallaşdırılması və tətbiq məntiqinin idarə olunması.",
    },
    {
      title: "Frontend Tərtibatçısı",
      developerUrl: Frontend,
      fullname: "Ruhid Məmmədzadə",
      me: "Mən cavabdeh və istifadəçi dostu veb tətbiqləri hazırlamağa yönəlmiş həvəsli bir frontend tərtibatçısıyam.",
      job: "Veb İnterfeys Mühəndisi",
      jobDescription:
        "Next.js kimi müasir framework-lərdən istifadə edərək performanslı istifadəçi interfeysləri hazırlayıram və genişlənə bilən frontend arxitekturasını saxlayıram.",
      toolTitle: "UI Alətləri",
      tools: "React Query, Next.js, ShadCN, Tailwind CSS, TypeScript",
      responsiblityTitle: "Öhdəliklər",
      responsiblityDescription:
        "Dizaynların koda çevrilməsi, backend komandaları ilə əməkdaşlıq, əlçatanlıq və performans optimallaşdırmalarının təmin edilməsi.",
    },
  ],
];
