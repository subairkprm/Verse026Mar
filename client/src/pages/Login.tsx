export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <img src="/spreadverse-logo.png" alt="SpreadVerse" className="h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">SpreadVerse</h1>
        <p className="text-slate-500 mb-8">UAE Banking & Financial Sales CRM</p>
        <a href="/api/auth/google" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/></svg>
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
