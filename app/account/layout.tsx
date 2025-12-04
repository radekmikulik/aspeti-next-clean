export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      <div className="max-w-4xl mx-auto p-8">
        <nav className="mb-8">
          <a
            href="/"
            className="text-blue-900 hover:text-blue-700 flex items-center gap-2"
          >
            <span>◀</span>
            Zpět na homepage
          </a>
        </nav>
        {children}
      </div>
    </div>
  );
}