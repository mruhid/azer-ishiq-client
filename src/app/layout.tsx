import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "@/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AzerIshiq",
    default: "AzerIshiq",
  },
  description: "The admin panel for Azrerishiq employeers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextTopLoader color="#1e3a8a" height={4} />

        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>

        <Toaster />

        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log("%cHELLO DEVELOPER!", "color: limegreen; font-size: 24px; font-weight: bold;");
                console.log("This is development mode — all console messages are visible.");
                // Suppress all console output
                ['log', 'warn', 'error'].forEach(method => {
                  console[method] = () => {};
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
