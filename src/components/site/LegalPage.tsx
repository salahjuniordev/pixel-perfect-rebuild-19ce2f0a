import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";

export function LegalLayout({ title, subtitle, updated, children }: { title: string; subtitle: string; updated?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <header className="pt-32 pb-12 bg-[#0a1120]">
        <div className="container-sj text-center">
          <nav className="text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[--brand]">Home</Link> <span className="mx-2">›</span> <span className="text-[--brand]">{title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{title}</h1>
          <p className="text-slate-300">{subtitle}</p>
          {updated && <p className="text-xs text-slate-500 mt-3">{updated}</p>}
        </div>
      </header>
      <main className="flex-1 section-padding !pt-16">
        <div className="container-sj max-w-4xl mx-auto">{children}</div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export function LegalCard({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="card-dark mb-6">
      <h2 className="text-xl font-bold text-white mb-4">{heading}</h2>
      <div className="text-slate-300 leading-relaxed space-y-3 text-sm">{children}</div>
    </div>
  );
}
