"use client";

import AccountSidebar from "@/components/AccountSidebar";
import AccountTopbar from "@/components/AccountTopbar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7F6] flex">
      <AccountSidebar />
      <div className="flex-1 flex flex-col">
        <AccountTopbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}