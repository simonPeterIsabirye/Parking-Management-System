import type {Metadata} from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ParkEase',
  description: 'A vehicle parking, tyre clinic, and battery management system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0C] text-slate-100 font-sans antialiased min-h-screen">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-5 bg-[#16161E] border-b border-slate-800 px-7 py-5 text-white shadow-lg">
          <div className="text-2xl font-black tracking-tighter text-blue-500">ParkEase</div>
          <nav className="flex flex-wrap gap-4 font-semibold">
            <Link href="/" className="opacity-90 hover:opacity-100">Dashboard</Link>
            <Link href="/register" className="opacity-90 hover:opacity-100">Register Vehicle</Link>
            <Link href="/service/tyre" className="opacity-90 hover:opacity-100">Tyre Clinic</Link>
            <Link href="/service/battery" className="opacity-90 hover:opacity-100">Battery Mgmt</Link>
            <Link href="/reports" className="opacity-90 hover:opacity-100">Reports</Link>
            <Link href="/admin" className="opacity-90 hover:opacity-100 text-blue-400 font-bold">Admin</Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-7">
          {children}
        </main>
      </body>
    </html>
  );
}
