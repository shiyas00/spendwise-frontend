import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  ListFilter,
  PlusCircle,
  ReceiptText,
} from "lucide-react";
import api from "@/api/axios";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function AddExpense() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/expenses/", {
        amount,
        category,
        description,
        transaction_date: transactionDate,
      });

      navigate("/expenses");
    } catch {
      setError("Failed to add expense. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <section className="px-6 py-8 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge className="mb-3 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              New Transaction
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Add Expense
            </h1>

            <p className="mt-2 text-slate-500">
              Record your spending with amount, category, date, and description.
            </p>
          </div>

          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => navigate("/expenses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Expenses
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-2xl">Expense Details</CardTitle>
              <CardDescription>
                Fill in the details below to save a new expense record.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleAddExpense} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>

                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="250.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-11 rounded-xl pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>

                    <div className="relative">
                      <ListFilter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        id="category"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-10 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="shopping">Shopping</option>
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="bills">Bills</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-date">Transaction Date</Label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="transaction-date"
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      className="h-11 rounded-xl pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>

                  <Textarea
                    id="description"
                    placeholder="Example: Lunch with friends"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-28 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 rounded-xl bg-emerald-500 px-5 font-semibold text-white hover:bg-emerald-600"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Expense"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <ReceiptText className="h-6 w-6" />
              </div>

              <CardTitle className="text-2xl">Quick Tip</CardTitle>
              <CardDescription className="text-slate-300">
                Keep your expense records clear and consistent.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Add a short description so you can identify the transaction later.
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Choose the correct category to improve dashboard summaries.
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Use the actual transaction date for accurate monthly tracking.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppLayout>
  );
}

export default AddExpense;