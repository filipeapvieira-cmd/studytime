import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="container mt-auto flex gap-2 py-10">
      <BookOpenCheck /> Built by
      <Link href="https://github.com/FilipeAPV" className="underline">
        Filipe
      </Link>
    </footer>
  );
}
