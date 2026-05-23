import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import Navbar from "@/components/Navbar";
import type { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Badge variant="secondary" className="mb-3">
              Expense Records
            </Badge>
            <h1 className="text-3xl font-bold text-slate-950">All Expenses</h1>
            <p className="mt-2 text-slate-500">
              View, manage, and delete your expense transactions.
            </p>
          </div>

          <Link to="/add-expense">
            <Button>Add Expense</Button>
          </Link>
        </div>

        {loading && <p className="text-slate-500">Loading expenses...</p>}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !expenses.length && (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold">No expenses found</h2>
              <p className="mt-2 text-slate-500">
                Start by adding your first expense record.
              </p>

              <Link to="/add-expense">
                <Button className="mt-5">Add Expense</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-5">
          {expenses.map((expense) => (
            <Card key={expense.id} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="capitalize">{expense.category}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    {expense.transaction_date}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-950">
                    ₹{expense.amount}
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {expense.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <p className="text-slate-600">
                  {expense.description || "No description added"}
                </p>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Expenses;