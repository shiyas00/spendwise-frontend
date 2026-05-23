import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  PlusCircle,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import api from "@/api/axios";
import AppLayout from "@/components/AppLayout";
import type { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/");
      setExpenses(response.data);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const thisMonthExpense = useMemo(() => {
    const now = new Date();

    return expenses
      .filter((expense) => {
        const date = new Date(expense.transaction_date);

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const todayExpense = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return expenses
      .filter((expense) => expense.transaction_date === today)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";
      summary[category] = (summary[category] || 0) + Number(expense.amount);
    });

    return Object.entries(summary)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const recentExpenses = expenses.slice(0, 5);

  const maxCategoryAmount =
    categorySummary.length > 0 ? categorySummary[0].amount : 1;

  return (
    <AppLayout>
      <section className="px-6 py-8 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Track spend, categories, and recent transactions.
            </p>
          </div>

          <Link to="/add-expense">
            <Button className="h-11 rounded-xl bg-emerald-500 px-5 font-semibold text-white hover:bg-emerald-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Expense"
            value={`₹${totalExpense.toLocaleString()}`}
            note="Updated live"
            icon={<TrendingUp />}
            color="bg-blue-500"
            iconBg="bg-blue-50"
            iconText="text-blue-600"
          />

          <StatCard
            title="This Month"
            value={`₹${thisMonthExpense.toLocaleString()}`}
            note="Monthly tracking"
            icon={<CalendarDays />}
            color="bg-emerald-500"
            iconBg="bg-emerald-50"
            iconText="text-emerald-600"
          />

          <StatCard
            title="Today"
            value={`₹${todayExpense.toLocaleString()}`}
            note="Today's spending"
            icon={<CreditCard />}
            color="bg-cyan-500"
            iconBg="bg-cyan-50"
            iconText="text-cyan-600"
          />

          <StatCard
            title="Transactions"
            value={expenses.length.toString()}
            note="Total records"
            icon={<ReceiptText />}
            color="bg-orange-500"
            iconBg="bg-orange-50"
            iconText="text-orange-600"
          />
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-950">
                Recent expenses
              </h2>

              <Link
                to="/expenses"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <p className="px-6 py-8 text-slate-500">Loading expenses...</p>
            ) : recentExpenses.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="font-semibold text-slate-950">No expenses yet</p>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first expense to see it here.
                </p>

                <Link to="/add-expense">
                  <Button className="mt-5 rounded-xl bg-emerald-500 hover:bg-emerald-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentExpenses.map((expense) => (
                      <tr key={expense.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-950">
                            {expense.description || "No description"}
                          </p>

                          <p className="text-xs text-slate-400">
                            exp-{expense.id}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                            {expense.category}
                          </Badge>
                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {expense.transaction_date}
                        </td>

                        <td className="px-6 py-5 font-bold text-slate-950">
                          ₹{Number(expense.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-slate-950">
              Category summary
            </h2>

            {categorySummary.length === 0 ? (
              <p className="text-sm text-slate-500">No category data yet.</p>
            ) : (
              <div className="space-y-5">
                {categorySummary.map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium capitalize text-slate-800">
                        {item.category}
                      </p>

                      <p className="font-bold text-slate-950">
                        ₹{item.amount.toLocaleString()}
                      </p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${Math.max(
                            (item.amount / maxCategoryAmount) * 100,
                            8
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function StatCard({
  title,
  value,
  note,
  icon,
  color,
  iconBg,
  iconText,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  color: string;
  iconBg: string;
  iconText: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className={`absolute left-0 top-0 h-1 w-full ${color}`} />

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{title}</p>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ${iconText} shadow-sm transition group-hover:scale-105`}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        </div>
      </div>

      <p className="text-3xl font-bold text-slate-950">{value}</p>

      <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
        <TrendingUp className="h-4 w-4" />
        {note}
      </p>
    </div>
  );
}

export default Dashboard;