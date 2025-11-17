#!/bin/bash
# Vytvoření statické verze pro rychlé testování
echo "Creating static HTML preview..."
mkdir -p /workspace/aspeti-next-clean-preview

# Vytvoření základní HTML struktury pro preview
cat > /workspace/aspeti-next-clean-preview/index.html << 'HTML'
<!DOCTYPE html>
<html lang="cs-CZ">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASPETi - Můj účet (Preview)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'sage-100': '#E7EFEA',
                        'sage-200': '#D2DED8',
                        'sage-300': '#CAD8D0',
                        'sage-400': '#C8D6CF',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#F5F7F6] text-gray-900">
    <div class="min-h-screen">
        <!-- AccountTopbar -->
        <div class="bg-white border-b border-[#D2DED8] px-6 py-3 flex items-center justify-between">
            <a href="#" class="text-blue-900 hover:text-blue-700 flex items-center gap-2">
                <span>◀</span><span>Domů</span>
            </a>
            <h1 class="text-lg font-semibold text-blue-900">poskytovatelský účet</h1>
            <a href="#" class="text-blue-900 hover:text-blue-700">Nastavení</a>
        </div>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-[#D2DED8] min-h-screen p-4">
                <nav class="space-y-1">
                    <a href="#" class="block px-4 py-2 rounded-md text-sm bg-[#E7EFEA] text-blue-900 font-medium">Přehled</a>
                    <a href="offers.html" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Moje nabídky</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Přidat nabídku</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Zprávy</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Rezervace</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">VIP & Propagace</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Statistiky</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Fakturace</a>
                    <a href="#" class="block px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#E7EFEA]">Profil</a>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-8">
                <div class="space-y-8">
                    <h1 class="text-3xl font-bold text-blue-900">Můj účet</h1>

                    <!-- KPI Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
                            <p class="text-sm text-gray-600 mb-2">Zobrazení dnes</p>
                            <p class="text-3xl font-bold text-blue-900">482</p>
                        </div>
                        <div class="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
                            <p class="text-sm text-gray-600 mb-2">Kliky dnes</p>
                            <p class="text-3xl font-bold text-blue-900">97</p>
                        </div>
                        <div class="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
                            <p class="text-sm text-gray-600 mb-2">Rezervace dnes</p>
                            <p class="text-3xl font-bold text-blue-900">3</p>
                        </div>
                    </div>

                    <!-- Co zlepšit -->
                    <div class="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
                        <h2 class="text-xl font-semibold text-blue-900 mb-4">Co zlepšit</h2>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-3">
                                <span class="text-blue-900 font-bold mt-1">•</span>
                                <p class="text-gray-700">Doplňte fotky k nabídce 'Masáž zad 45 min' – nabídky s fotkami mají o 67% více kliků</p>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="text-blue-900 font-bold mt-1">•</span>
                                <p class="text-gray-700">Nastavte platnost akce u 'Lash lifting' – časově omezené nabídky zvyšují konverzi o 23%</p>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="text-blue-900 font-bold mt-1">•</span>
                                <p class="text-gray-700">Vyplňte IČO v profilu – zvyšuje důvěryhodnost a umožňuje výstavbu faktur</p>
                            </li>
                        </ul>
                    </div>

                    <div class="text-sm text-gray-500 mt-8">
                        <p>ℹ️ Toto je statický preview. Plná funkcionalita vyžaduje Next.js deployment na Vercel.</p>
                        <p class="mt-2">GitHub: <a href="https://github.com/radekmikulik/aspeti-next-clean" class="text-blue-700 underline">radekmikulik/aspeti-next-clean</a></p>
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>
HTML

echo "Preview created at /workspace/aspeti-next-clean-preview/index.html"
