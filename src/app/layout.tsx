import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vocabbo",
  description: "Learn new words and improve your vocabulary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-[calc(100vh-280px)] flex flex-col justify-center items-center w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
