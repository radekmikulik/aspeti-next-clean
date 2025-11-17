"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/account", label: "Přehled" },
  { href: "/account/offers", label: "Moje nabídky" },
  { href: "/account/offers/new", label: "Přidat nabídku" },
  { href: "/account/messages", label: "Zprávy" },
  { href: "/account/reservations", label: "Rezervace" },
  { href: "/account/vip", label: "VIP & Propagace" },
  { href: "/account/stats", label: "Statistiky" },
  { href: "/account/billing", label: "Fakturace" },
  { href: "/account/profile", label: "Profil" },
  { href: "/account/settings", label: "Nastavení" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#D2DED8] min-h-screen p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#E7EFEA] text-blue-900 font-medium"
                  : "text-gray-700 hover:bg-[#E7EFEA]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
