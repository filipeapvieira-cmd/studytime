import Header from "@/components/header/header";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/lib/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import Footer from "@/components/footer";

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
      <body
        className={`${inter.className} bg-background min-h-screen flex flex-col`}
      >
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
