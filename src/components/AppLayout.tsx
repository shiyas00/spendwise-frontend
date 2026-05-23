import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  PlusCircle,
  ReceiptText,
  Search,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";
  const userInitial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
            <WalletCards className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">SpendWise</h1>
            <p className="text-sm text-slate-400">Expense Tracker</p>
          </div>
        </div>

        <nav className="space-y-2">
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
          />

          <SidebarLink
            to="/expenses"
            icon={<ListChecks />}
            label="Expenses"
            active={location.pathname === "/expenses"}
          />

          <SidebarLink
            to="/add-expense"
            icon={<PlusCircle />}
            label="Add Expense"
            active={location.pathname === "/add-expense"}
          />

          <SidebarLink
            to="/reports"
            icon={<ReceiptText />}
            label="Reports"
            active={location.pathname === "/reports"}
          />
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-4 lg:px-8">
            <div className="relative hidden w-full max-w-md md:block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search transactions"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold capitalize text-slate-950">
                  {username}
                </p>
                <p className="text-xs text-slate-500">Logged in user</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                {userInitial}
              </div>

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  active,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  to: string;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
        active
          ? "bg-white !text-slate-950 shadow-sm"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`[&>svg]:h-5 [&>svg]:w-5 ${
          active ? "[&>svg]:text-slate-950" : "[&>svg]:text-slate-300"
        }`}
      >
        {icon}
      </span>

      <span className={active ? "text-slate-950" : "text-slate-300"}>
        {label}
      </span>
    </Link>
  );
}

export default AppLayout;