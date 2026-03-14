import { useState, useEffect } from "react";
export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch("/api/dashboard/stats").then(r=>r.json()).then(setStats); }, []);
  if (!stats) return <div>Loading...</div>;
  const cards = [{label:"Total Leads",value:stats.totalLeads,color:"bg-blue-500"},{label:"Total Contacts",value:stats.totalContacts,color:"bg-green-500"},{label:"Total Deals",value:stats.totalDeals,color:"bg-purple-500"},{label:"Open Tasks",value:stats.openTasks,color:"bg-orange-500"},{label:"Revenue",value:"$"+Number(stats.revenue).toLocaleString(),color:"bg-emerald-500"},{label:"Pipeline Value",value:"$"+Number(stats.pipelineValue).toLocaleString(),color:"bg-indigo-500"}];
  return (<div><h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{cards.map(c=>(<div key={c.label} className="bg-white rounded-xl shadow p-6"><div className={`inline-block px-3 py-1 rounded-full text-white text-xs mb-3 ${c.color}`}>{c.label}</div><p className="text-3xl font-bold text-slate-900">{c.value}</p></div>))}</div></div>);
}
