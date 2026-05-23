export interface Expense {
  id: number;
  amount: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

export interface ExpenseSummary {
  total_expense: number;
  monthly_total: number;
  total_transactions: number;
  highest_expense: number;
  category_summary: CategorySummary[];
  recent_expenses: Expense[];
}