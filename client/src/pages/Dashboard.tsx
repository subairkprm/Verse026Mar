import { useEffect, useState } from "react";
export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch("/api/leads").then(r => r.json()).then(setStats).catch(() => {}); }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <img src="/spreadverse-logo.png" alt="SpreadVerse" className="h-8" />
        <h1 className="text-xl font-bold text-slate-800">SpreadVerse CRM</h1>
      </header>
      <main className="p-6"><h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Total Leads","New","Interested","Converted"].map(label => (
            <div key={label} className="bg-white rounded-xl shadow p-6"><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold text-slate-800">0</p></div>
          ))}
        </div>
      </main>
    </div>
  );
}
