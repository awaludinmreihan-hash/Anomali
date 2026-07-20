import type { Metadata } from "next";
import { Zilla_Slab, PT_Serif, Courier_Prime } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

const display = Zilla_Slab({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const body = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});
const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Arsip Anomali Indonesia`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-serif min-h-screen flex flex-col">
        <header className="border-b-4 border-arsip-ink bg-kraft-50/60">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="font-display font-bold text-2xl tracking-tight text-arsip-ink">
                {SITE.name.toUpperCase()}
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-arsip-soft border border-arsip-line px-1.5 py-0.5 rounded">
                ARSIP TERBUKA
              </span>
            </Link>
            <nav className="flex items-center gap-5 font-mono text-sm uppercase tracking-wide text-arsip-ink">
              <Link href="/" className="hover:text-stempel transition-colors">
                Indeks
              </Link>
              <Link href="/cari" className="hover:text-stempel transition-colors">
                Cari
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t-4 border-arsip-ink bg-kraft-50/60 mt-16">
          <div className="max-w-5xl mx-auto px-5 py-8 font-mono text-xs text-arsip-soft flex flex-col sm:flex-row justify-between gap-3">
            <p>
              {SITE.name} — karya fiksi. Semua nama, kejadian, dan lembaga bersifat
              rekaan, kesamaan dengan yang nyata semata gaya bercerita.
            </p>
            <p>&copy; {new Date().getFullYear()} {SITE.name}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
