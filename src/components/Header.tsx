import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  logoUrl: string;
  showAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick, logoUrl, showAdmin = false }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-zinc-200/50">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={logoUrl} 
            alt="FOORSA Logo" 
            className="h-7 w-auto object-contain brightness-0 opacity-90"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.className = 'font-bold text-lg tracking-tight text-black';
              fallback.textContent = 'FOORSA';
              img.parentElement?.appendChild(fallback);
            }}
          />
        </div>
        
        {showAdmin && (
          <button 
            onClick={onAdminClick}
            className="p-2 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
            aria-label="Admin Access"
          >
            <Menu size={20} />
          </button>
        )}
      </div>
    </header>
  );
};