import { useEffect, useState } from "react";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
import type { ExpenseSummary } from "@/types/expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function Dashboard() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const response = await api.get("/summary/");
      setSummary(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="secondary" className="mb-3">
              Expense Overview
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Monitor spending patterns and financial activity in one place.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading dashboard...</p>
        ) : (
          <>
            <section className="grid gap-5 md:grid-cols-4">
              <StatCard title="Total Expense" value={`₹${summary?.total_expense ?? 0}`} />
              <StatCard title="Monthly Expense" value={`₹${summary?.monthly_total ?? 0}`} />
              <StatCard title="Transactions" value={`${summary?.total_transactions ?? 0}`} />
              <StatCard title="Highest Expense" value={`₹${summary?.highest_expense ?? 0}`} />
            </section>

            <section className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Category Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary?.category_summary.length ? (
                    summary.category_summary.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-medium capitalize">{item.category}</p>
                          <p className="text-sm text-slate-500">{item.count} transactions</p>
                        </div>
                        <p className="font-bold">₹{item.total}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No category data yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary?.recent_expenses.length ? (
                    summary.recent_expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-medium capitalize">{expense.category}</p>
                          <p className="text-sm text-slate-500">{expense.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{expense.amount}</p>
                          <p className="text-xs text-slate-500">{expense.transaction_date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recent expenses yet.</p>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>  
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

export default Dashboard;