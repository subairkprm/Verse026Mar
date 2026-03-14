import { useState, useEffect } from "react";
export function Leads() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/leads").then(r=>r.json()).then(setItems).catch(()=>{}); }, []);
  return (<div><h2 className="text-2xl font-bold text-slate-900 mb-6">Leads</h2><div className="bg-white rounded-xl shadow"><div className="p-4 border-b flex justify-between items-center"><span className="text-gray-500">{items.length} leads</span><button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Lead</button></div><div className="divide-y">{items.length===0?<div className="p-8 text-center text-gray-400">No leads yet</div>:items.map((item:any)=>(<div key={item.id} className="p-4 hover:bg-gray-50 flex justify-between"><div><p className="font-medium">{item.name||item.title||item.subject||`Lead #${item.id}`}</p><p className="text-sm text-gray-500">{item.email||item.status||item.stage||""}</p></div></div>))}</div></div></div>);
}
