import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 border-r border-gray-200 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prep AI</h1>
          <p className="text-sm text-gray-500">Seu assistente de preparação</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/upload" className="text-gray-700 hover:text-indigo-600">
            Upload
          </Link>
          <Link to="/roadmap" className="text-gray-700 hover:text-indigo-600">
            Roadmap
          </Link>
          <Link to="/leetcode" className="text-gray-700 hover:text-indigo-600">
            LeetCode
          </Link>
          <Link to="/pitch" className="text-gray-700 hover:text-indigo-600">
            Pitch
          </Link>
          <Link to="/interview" className="text-gray-700 hover:text-indigo-600">
            Interview
          </Link>
        </nav>

        <div className="mt-auto text-xs text-gray-400">&copy; Prep AI</div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
