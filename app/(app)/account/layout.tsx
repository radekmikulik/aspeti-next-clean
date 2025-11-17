import AccountTopbar from "@/components/AccountTopbar";
import AccountSidebar from "@/components/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AccountTopbar />
      <div className="flex">
        <AccountSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
