import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
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

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);

      const backendError =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Check username and password.";

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10">
      <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-10 md:grid-cols-2">
        <section className="text-white">
          <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            Spend smarter. Track faster.
          </div>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
            SpendWise Expense Management
          </h1>

          <p className="mt-5 max-w-lg text-lg text-slate-300">
            A secure dashboard for tracking daily expenses, category-wise
            spending, monthly totals, and recent transactions.
          </p>

          <div className="mt-8 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">JWT</p>
              <p className="text-sm text-slate-300">Authentication</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">DRF</p>
              <p className="text-sm text-slate-300">REST APIs</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-2xl font-bold">PSQL</p>
              <p className="text-sm text-slate-300">Database</p>
            </div>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password to access your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  placeholder="testuser"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">
                  Use username, not email.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full" disabled={loading} type="submit">
                {loading ? "Signing in..." : "Login"}
              </Button>

              <p className="text-center text-sm text-slate-600">
                New user?{" "}
                <Link to="/register" className="font-medium text-slate-950 underline">
                  Create account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Login;