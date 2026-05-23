import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  PieChart,
  TrendingUp,
} from "lucide-react";
import api from "@/api/axios";
import AppLayout from "@/components/AppLayout";
import type { Expense } from "@/types/expense";

function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/");
      setExpenses(response.data);
    } catch {
      setError("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    return totalSpend / expenses.length;
  }, [expenses.length, totalSpend]);

  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";
      summary[category] = (summary[category] || 0) + Number(expense.amount);
    });

    return Object.entries(summary)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalSpend]);

  const topCategory = categorySummary[0];

  const monthlySummary = useMemo(() => {
    const months = [
      { label: "Jan", value: 0 },
      { label: "Feb", value: 0 },
      { label: "Mar", value: 0 },
      { label: "Apr", value: 0 },
      { label: "May", value: 0 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
      { label: "Aug", value: 0 },
      { label: "Sep", value: 0 },
      { label: "Oct", value: 0 },
      { label: "Nov", value: 0 },
      { label: "Dec", value: 0 },
    ];

    expenses.forEach((expense) => {
      const date = new Date(expense.transaction_date);
      const monthIndex = date.getMonth();

      if (!Number.isNaN(monthIndex)) {
        months[monthIndex].value += Number(expense.amount);
      }
    });

    return months;
  }, [expenses]);

  const maxMonthValue = Math.max(...monthlySummary.map((item) => item.value), 1);

  return (
    <AppLayout>
      <section className="px-6 py-8 lg:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Reports
          </h1>
          <p className="mt-2 text-slate-500">
            Summary insights for spending patterns and category allocation.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading reports...
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <ReportCard
                title="Total Spend"
                value={`₹${totalSpend.toLocaleString()}`}
                note="Across all records"
                icon={<BarChart3 />}
                iconClass="bg-slate-100 text-slate-950"
              />

              <ReportCard
                title="Average Expense"
                value={`₹${Math.round(averageExpense).toLocaleString()}`}
                note="Per transaction"
                icon={<TrendingUp />}
                iconClass="bg-emerald-50 text-emerald-600"
              />

              <ReportCard
                title="Top Category"
                value={topCategory ? topCategory.category : "No data"}
                note={
                  topCategory
                    ? `₹${topCategory.amount.toLocaleString()}`
                    : "Add expenses first"
                }
                icon={<PieChart />}
                iconClass="bg-cyan-50 text-cyan-600"
              />
            </div>

            <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Monthly spending trend
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Month-wise expense distribution.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    <CalendarDays className="h-4 w-4" />
                    2026
                  </div>
                </div>

                {expenses.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                    No monthly data yet.
                  </div>
                ) : (
                  <div className="flex h-80 items-end gap-4 rounded-2xl bg-slate-50 p-6">
                    {monthlySummary.map((month) => {
                      const height = Math.max(
                        (month.value / maxMonthValue) * 100,
                        month.value > 0 ? 8 : 4
                      );

                      return (
                        <div
                          key={month.label}
                          className="flex h-full flex-1 flex-col justify-end gap-3"
                        >
                          <div className="flex h-full items-end">
                            <div
                              className="w-full rounded-t-xl bg-slate-950 transition hover:bg-emerald-500"
                              style={{ height: `${height}%` }}
                              title={`₹${month.value.toLocaleString()}`}
                            />
                          </div>

                          <p className="text-center text-sm font-medium text-slate-500">
                            {month.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Category allocation
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Percentage split of your spending.
                </p>

                {categorySummary.length === 0 ? (
                  <div className="mt-8 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
                    No category data yet.
                  </div>
                ) : (
                  <div className="mt-7 space-y-6">
                    {categorySummary.map((item) => (
                      <div key={item.category}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-semibold capitalize text-slate-800">
                            {item.category}
                          </p>
                          <p className="font-bold text-slate-950">
                            {item.percentage}%
                          </p>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${Math.max(item.percentage, 6)}%` }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          ₹{item.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}

function ReportCard({
  title,
  value,
  note,
  icon,
  iconClass,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{title}</p>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
        </div>
      </div>

      <p className="text-3xl font-bold capitalize text-slate-950">{value}</p>

      <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-emerald-600">
        <TrendingUp className="h-4 w-4" />
        {note}
      </p>
    </div>
  );
}

export default Reports;