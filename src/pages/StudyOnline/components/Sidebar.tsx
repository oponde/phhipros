import React from 'react';
import { usePhhiprosAuth } from '../../../contexts/PhhiprosAuthContext';
import { User } from '../../../types/study-online';

interface SidebarItem {
  key: string;
  label: string;
}

interface SidebarProps {
  user: User;
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function Sidebar({ user, items, activeKey, onSelect }: SidebarProps) {
  const { setUserId } = usePhhiprosAuth();

  return (
    <div className="w-full lg:w-[230px] flex-shrink-0 bg-[#14231C] text-[#F5F1E6] flex flex-col lg:min-h-screen py-6">
      <div className="px-6 pb-6 border-b border-[rgba(245,241,230,0.16)] mb-2.5 hidden lg:block">
        <div className="font-serif text-2xl font-bold flex items-baseline gap-0.5">
          PHHIPROS<span className="text-[#E8C866]">237</span>
        </div>
        <div className="text-[11.5px] uppercase tracking-[0.06em] text-[rgba(245,241,230,0.55)] mt-1">
          {user.role} portal
        </div>
      </div>

      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`px-6 py-3 font-medium text-sm transition-all whitespace-nowrap text-left border-l-4 lg:border-l-4 lg:border-b-0 border-b-4 lg:border-transparent ${
              activeKey === item.key 
                ? 'text-white border-[#D4A62A] bg-[rgba(255,255,255,0.06)]' 
                : 'text-[rgba(245,241,230,0.8)] border-transparent hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-6 pt-4 border-t border-[rgba(245,241,230,0.16)] hidden lg:block">
        <div className="font-semibold text-[13.5px] truncate">{user.name}</div>
        <div className="text-[11.5px] text-[rgba(245,241,230,0.55)] mb-2.5 truncate">{user.email}</div>
        <button 
          onClick={() => setUserId(null)}
          className="text-[12.5px] underline text-[rgba(245,241,230,0.7)] hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Mobile user info */}
      <div className="lg:hidden px-6 pt-4 flex items-center justify-between gap-4">
        <div className="truncate">
          <div className="font-semibold text-[12px] truncate">{user.name}</div>
        </div>
        <button 
          onClick={() => setUserId(null)}
          className="text-[11px] underline text-[rgba(245,241,230,0.7)]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
