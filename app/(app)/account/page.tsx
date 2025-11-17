"use client";

export default function AccountDashboard() {
  const kpiData = [
    { label: "Zobrazení dnes", value: "482" },
    { label: "Kliky dnes", value: "97" },
    { label: "Rezervace dnes", value: "3" },
  ];

  const improvements = [
    "Doplňte fotky k nabídce 'Masáž zad 45 min' – nabídky s fotkami mají o 67% více kliků",
    "Nastavte platnost akce u 'Lash lifting' – časově omezené nabídky zvyšují konverzi o 23%",
    "Vyplňte IČO v profilu – zvyšuje důvěryhodnost a umožňuje výstavbu faktur",
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">Můj účet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-blue-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Co zlepšit
        </h2>
        <ul className="space-y-3">
          {improvements.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-blue-900 font-bold mt-1">•</span>
              <p className="text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
