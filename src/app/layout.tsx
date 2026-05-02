import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FloatingBackground } from "@/components/FloatingBackground";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nadiandra",
  description: "A cute space for us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden selection:bg-(--color-accent) selection:text-(--color-text-primary)">
        <ThemeProvider>
          <FloatingBackground />
          <ProtectedRoute>
            <Navbar />
            <main className="flex-1 pt-24 pb-12 px-4 max-w-4xl mx-auto w-full z-10">
              {children}
            </main>
          </ProtectedRoute>
        </ThemeProvider>
      </body>
    </html>
  );
}
