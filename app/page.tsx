import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-900">
          ASPETi – Aplikační část
        </h1>
        <p className="text-lg text-gray-700">
          Toto je app část ASPETi (Můj účet). Veřejné nabídky najdete na landing stránce.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/account"
            className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Přejít do účtu
          </Link>
        </div>
      </div>
    </div>
  );
}
