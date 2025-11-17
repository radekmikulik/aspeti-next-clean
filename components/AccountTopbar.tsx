import Link from "next/link";

export default function AccountTopbar() {
  return (
    <div className="bg-white border-b border-[#D2DED8] px-6 py-3 flex items-center justify-between">
      <Link
        href="/"
        className="text-blue-900 hover:text-blue-700 flex items-center gap-2"
      >
        <span>◀</span>
        <span>Domů</span>
      </Link>
      <h1 className="text-lg font-semibold text-blue-900">
        poskytovatelský účet
      </h1>
      <Link
        href="/account/settings"
        className="text-blue-900 hover:text-blue-700"
      >
        Nastavení
      </Link>
    </div>
  );
}
