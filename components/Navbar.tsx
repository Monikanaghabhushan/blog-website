"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none animate-slide-down px-4">
      <nav className="pointer-events-auto flex justify-between items-center px-6 py-3 backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-full shadow-2xl shadow-black/50 ring-1 ring-white/5 w-full max-w-2xl">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:to-white transition-all cursor-pointer">
            Nex<span className="text-accent">Blog</span>
          </h1>
        </Link>

      <div className="flex gap-8 items-center">
        <Link
          href="/"
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          href="/authors"
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 hover:glow"
        >
          Authors
        </Link>
      </div>
      </nav>
    </div>
  );
}
