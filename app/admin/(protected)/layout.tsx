import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthed();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="border-b border-arsip-line bg-arsip-ink text-kraft-50">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between font-mono text-xs uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-stempel-light">Dasbor</Link>
            <Link href="/admin/tulis" className="hover:text-stempel-light">Berkas baru</Link>
            <Link href="/admin/komentar" className="hover:text-stempel-light">Moderasi komentar</Link>
          </div>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
