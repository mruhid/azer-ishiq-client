"use client";

import {
  ShieldCheck,
  LogIn,
  LayoutDashboard,
  UserPlus,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function RulesComponent({ lang = "en" }: { lang?: string }) {
  const isAz = lang === "az";

  return (
    <div className="mx-auto w-full px-6 py-10 text-muted-foreground">
      <h1 className="mb-8 flex items-center gap-2 text-4xl font-bold text-primary">
        <ShieldCheck className="h-8 w-8 text-primary" />
        {isAz ? "Azərişıq Sistem Qaydaları" : "Azerishiq System Rules"}
      </h1>

      {/* Login Policy */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <LogIn className="h-5 w-5 text-primary" />
          {isAz ? "1. Giriş Qaydaları" : "1. Login Policy"}
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            {isAz
              ? "Yalnız qeydiyyatdan keçmiş istifadəçilər istifadəçi adı və parol ilə daxil ola bilər."
              : "Only registered users can log in using a secure username and password."}
          </li>
          <li>
            {isAz
              ? "Parollar təhlükəsizlik tələblərinə cavab verməlidir."
              : "Passwords must meet our strength requirements."}
          </li>
          <li>
            {isAz
              ? "İlk dəfə daxil olduqda istifadəçilərə rol təyin olunur (Admin, Yoxlayıcı, İzləyici)."
              : "On first login, users are assigned a role (Admin, Inspector, Viewer)."}
          </li>
        </ul>
      </section>

      {/* Role-Based Access */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          {isAz
            ? "2. Rol əsaslı panelə giriş"
            : "2. Role-Based Dashboard Access"}
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Admin:</strong>{" "}
            {isAz
              ? "İstifadəçi və məlumat idarəçiliyinə tam nəzarət."
              : "Full control including user and data management."}
          </li>
          <li>
            <strong>Yoxlayıcı / Inspector:</strong>{" "}
            {isAz
              ? "Yoxlamalara, sahə yeniləmələrinə və hesabatlara çıxış."
              : "Access to inspections, field updates, and reports."}
          </li>
          <li>
            <strong>İzləyici / Viewer:</strong>{" "}
            {isAz
              ? "Təyin olunmuş modullara baxış hüququ."
              : "View-only access to assigned modules."}
          </li>
          <li>
            {isAz
              ? "İcazəsiz giriş cəhdləri qeydə alınır və rədd edilir."
              : "Unauthorized role-based access attempts are denied and logged."}
          </li>
        </ul>
      </section>

      {/* First Time Login */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <UserPlus className="h-5 w-5 text-primary" />
          {isAz
            ? "3. İlk girişdə görüləcək işlər"
            : "3. First-Time Login Instructions"}
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            {isAz
              ? "Müvəqqəti parolunuzu dərhal dəyişin."
              : "Change your temporary password immediately."}
          </li>
          <li>
            {isAz
              ? "Admin və Yoxlayıcılar 2 faktorlu doğrulama aktiv etməlidir."
              : "Admins and Inspectors must enable 2FA."}
          </li>
          <li>
            {isAz
              ? "Tam giriş üçün şərtləri və qaydaları qəbul edin."
              : "Accept all terms and policies before full access is granted."}
          </li>
        </ul>
      </section>

      {/* Security Measures */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-primary" />
          {isAz
            ? "4. Təhlükəsizlik və Hack əleyhinə tədbirlər"
            : "4. Security & Anti-Hacking Measures"}
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            {isAz
              ? "Bütün fəaliyyətlər izlənilir və qeydə alınır (istifadəçi, zaman, IP)."
              : "All system activity is monitored and logged (user, time, IP)."}
          </li>
          <li>
            {isAz
              ? "Kod təhlükəsizlik baxımından qorunur və analizə qarşı tədbirlər görülüb."
              : "Code is hardened and protected against injection, XSS, and reverse engineering."}
          </li>
          <li>
            {isAz
              ? "Pozuntular avtomatik bloklama və sistemin bağlanması ilə nəticələnir."
              : "Violations trigger automatic account bans and system lockdowns."}
          </li>
          <li>
            {isAz
              ? "Kiber təhlükəsizlik komandası real vaxtda analiz aparır."
              : "Cybersecurity team reviews suspicious activity in real time."}
          </li>
        </ul>
      </section>

      {/* Data Confidentiality */}
      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Lock className="h-5 w-5 text-primary" />
          {isAz ? "5. Məlumatların məxfiliyi" : "5. Data Confidentiality"}
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            {isAz
              ? "Bütün məlumatlar ötürülmə və saxlanma zamanı şifrələnir."
              : "All data is encrypted in transit and at rest."}
          </li>
          <li>
            {isAz
              ? "Giriş məlumatlarınızı başqaları ilə paylaşmayın."
              : "Do not share your credentials with anyone."}
          </li>
          <li>
            {isAz
              ? "Məlumatların icazəsiz paylaşılması qadağandır."
              : "Unauthorized export or exposure of data is strictly prohibited."}
          </li>
        </ul>
      </section>
    </div>
  );
}
