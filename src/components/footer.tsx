import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="max-w-6xl md:min-w-[1000px] w-4/5 mx-auto mt-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 text-sm text-neutral-500">
      <Link
        href="/privacy"
        className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
      >
        Privacy Notice
      </Link>

      <div className="flex items-center gap-2">
        <BookOpenCheck className="h-4 w-4" />
        <span>Built by</span>
        <Link
          href="https://github.com/filipeapvieira-cmd"
          className="underline hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
        >
          Filipe
        </Link>
      </div>
    </footer>
  );
}
