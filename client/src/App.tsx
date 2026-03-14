import { useState, useEffect } from "react";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { Leads } from "./pages/Leads";
import { Contacts } from "./pages/Contacts";
import { Deals } from "./pages/Deals";
import { Tasks } from "./pages/Tasks";
import { Accounts } from "./pages/Accounts";
import { Pipelines } from "./pages/Pipelines";

export type Page = "dashboard"|"leads"|"contacts"|"deals"|"tasks"|"accounts"|"pipelines";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Page>("dashboard");
  useEffect(() => {
    fetch("/api/auth/user").then(r => r.ok ? r.json() : null).then(u => { setUser(u); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>;
  if (!user) return <Login />;
  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard />;
      case "leads": return <Leads />;
      case "contacts": return <Contacts />;
      case "deals": return <Deals />;
      case "tasks": return <Tasks />;
      case "accounts": return <Accounts />;
      case "pipelines": return <Pipelines />;
      default: return <Dashboard />;
    }
  };
  return (<div className="flex h-screen bg-gray-50"><Sidebar user={user} page={page} setPage={setPage} /><main className="flex-1 overflow-auto p-6">{renderPage()}</main></div>);
}
