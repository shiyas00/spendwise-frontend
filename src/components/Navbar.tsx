import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">SpendWise</h1>
            <p className="text-xs text-slate-500">Expense Intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/dashboard" className="hover:text-slate-950">
            Dashboard
          </Link>
          <Link to="/expenses" className="hover:text-slate-950">
            Expenses
          </Link>
          <Link to="/add-expense" className="hover:text-slate-950">
            Add Expense
          </Link>
        </nav>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Navbar;