import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/payments', label: 'Payments' },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="px-6 py-5">
          <p className="text-lg font-semibold text-gray-900">Frenno Transport</p>
          <p className="text-xs text-gray-400">Powered by Frenno Technologies Ltd.</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
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
          <button
            onClick={logout}
            className="mt-3 text-sm font-medium text-gray-500 hover:text-gray-900"
            type="button"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
