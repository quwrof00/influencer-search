import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "sonner";
import { useProfileStore } from "@/store/useProfileStore";
import { ListPanel } from "./ListPanel";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children }: LayoutProps) {
  const [listOpen, setListOpen] = useState(false);
  const selectedCount = useProfileStore((s) => s.selectedProfiles.length);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-black/5 bg-[#FAF8F4] sticky top-0 z-30">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 text-xl font-black tracking-tighter"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">W</span>
          </div>
          Wobb
        </Link>

        {/* My List button */}
        <button
          onClick={() => setListOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black/10 hover:border-black transition-colors font-bold text-sm"
          aria-label="Open campaign list"
        >
          My List
          {selectedCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-black flex items-center justify-center">
              {selectedCount}
            </span>
          )}
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

      <ListPanel isOpen={listOpen} onClose={() => setListOpen(false)} />
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
