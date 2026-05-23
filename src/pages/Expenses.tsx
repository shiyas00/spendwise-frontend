import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import AppLayout from "@/components/AppLayout";
import type { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2 } from "lucide-react";

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/");
      setExpenses(response.data);
    } catch {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/expenses/${id}/`);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch {
      alert("Failed to delete expense.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <AppLayout>
      <section className="px-6 py-8 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge className="mb-3 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              Expense Records
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              All Expenses
            </h1>

            <p className="mt-2 text-slate-500">
              View, manage, and delete your expense transactions.
            </p>
          </div>

          <Link to="/add-expense">
            <Button className="h-11 rounded-xl bg-emerald-500 px-5 font-semibold text-white hover:bg-emerald-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
            Loading expenses...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && expenses.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">
              No expenses found
            </h2>

            <p className="mt-2 text-slate-500">
              Start by adding your first expense record.
            </p>

            <Link to="/add-expense">
              <Button className="mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </Link>
          </div>
        )}

        {!loading && expenses.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-950">
                Expense History
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete list of your recorded transactions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-950">
                          {expense.description || "No description"}
                        </p>
                        <p className="text-xs text-slate-400">exp-{expense.id}</p>
                      </td>

                      <td className="px-6 py-5">
                        <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                          {expense.category}
                        </Badge>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {expense.transaction_date}
                      </td>

                      <td className="px-6 py-5 text-lg font-bold text-slate-950">
                        ₹{Number(expense.amount).toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}

export default Expenses;