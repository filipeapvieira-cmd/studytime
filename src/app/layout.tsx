import Header from "@/src/components/header/header";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/src/components/footer";
import { Toaster } from "@/src/components/ui/toaster";
import Providers from "@/src/lib/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Study Time",
  description: "Keep track of your studies...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-screen `}>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
