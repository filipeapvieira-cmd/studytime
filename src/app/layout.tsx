import Header from "@/src/components/header/header";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/src/lib/Providers";
import { Toaster } from "@/src/components/ui/toaster";
import { Metadata } from "next";
import Footer from "@/src/components/footer";

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
