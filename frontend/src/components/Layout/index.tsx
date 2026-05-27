import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex bg-[#1c1c1c] text-[#ffffff]">
      <aside className="w-64 border-r border-gray-700 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#ffffff]">Prep AI</h1>
          <p className="text-sm text-[#9a9a9a]">Seu assistente de preparação</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link to="/upload" className="text-[#ffffff] hover:text-indigo-400">
            Upload
          </Link>
          <Link to="/roadmap" className="text-[#ffffff] hover:text-indigo-400">
            Roadmap
          </Link>
          <Link to="/leetcode" className="text-[#ffffff] hover:text-indigo-400">
            LeetCode
          </Link>
          <Link to="/pitch" className="text-[#ffffff] hover:text-indigo-400">
            Pitch
          </Link>
          <Link to="/interview" className="text-[#ffffff] hover:text-indigo-400">
            Interview
          </Link>
        </nav>

        <div className="mt-auto text-xs text-[#9a9a9a]">&copy; Prep AI</div>
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
