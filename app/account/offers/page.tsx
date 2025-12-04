export default function OffersPage() {
  return (
    <div className="min-h-screen bg-[#F5F7F6] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Moje nabídky
        </h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-gray-700 mb-4">
            Zde budou vaše nabídky.
          </p>
          <a
            href="/account"
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
          >
            Zpět do účtu
          </a>
        </div>
      </div>
    </div>
  );
}