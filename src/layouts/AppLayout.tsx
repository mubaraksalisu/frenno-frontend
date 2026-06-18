import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/payments', label: 'Payments' },
  { to: '/admins', label: 'Admins' },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 sm:static sm:w-60 sm:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
              F
            </span>
            <div>
              <p className="whitespace-nowrap text-base font-semibold text-gray-900">Frenno Transport</p>
              <p className="text-xs text-gray-400">Powered by Frenno Technologies Ltd.</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
            aria-label="Close menu"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileNavOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 px-6 py-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <button onClick={logout} className="mt-3 text-sm font-medium text-gray-500 hover:text-indigo-700" type="button">
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              F
            </span>
            <span className="text-sm font-semibold text-gray-900">Frenno Transport</span>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(true)}
            type="button"
            aria-label="Open menu"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
