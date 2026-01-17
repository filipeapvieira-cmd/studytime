import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto mt-auto flex gap-2 py-4 px-4 text-sm text-neutral-500">
      <BookOpenCheck /> Built by
      <Link href="https://github.com/filipeapvieira-cmd" className="underline">
        Filipe
      </Link>
    </footer>
  );
}
