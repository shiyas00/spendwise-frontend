import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  Lock,
  User,
  WalletCards,
  ShieldCheck,
  PieChart,
  FolderClosed,
} from "lucide-react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (err: any) {
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.25),_transparent_35%)]" />
      <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-160px] h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[82vh] max-w-6xl items-center gap-20 md:grid-cols-[1fr_0.9fr]">
        <section className="max-w-2xl">
          <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            Spend smarter. Track faster.
          </div>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-5xl">
            SpendWise helps you take control of your{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              spending
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Track your daily expenses, view spending summaries, and stay in
            control with one simple dashboard.
          </p>

          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-emerald-300" />}
              title="Secure Access"
              subtitle="Protected sign-in"
              glow="bg-emerald-400/20"
            />

            <FeatureCard
              icon={<PieChart className="h-6 w-6 text-sky-300" />}
              title="Insights"
              subtitle="Clear overview"
              glow="bg-sky-400/20"
            />

            <FeatureCard
              icon={<FolderClosed className="h-6 w-6 text-violet-300" />}
              title="Safe Records"
              subtitle="Expense history"
              glow="bg-violet-400/20"
            />
          </div>
        </section>

        <section className="w-full max-w-sm justify-self-center md:justify-self-end">
          <div className="rounded-[1.75rem] border border-white/25 bg-white/15 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 to-emerald-500 shadow-lg shadow-teal-500/30">
              <WalletCards className="h-7 w-7 text-slate-950" />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-300">
                Sign in to continue to your expense dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-username" className="text-slate-100">
                  Username
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="login-username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 border-white/20 bg-white/85 pl-10 text-slate-950 placeholder:text-slate-400"
                    required
                  />
                </div>

                <p className="text-xs text-slate-300">Use username, not email.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-100">
                  Password
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-white/20 bg-white/85 pl-10 pr-10 text-slate-950 placeholder:text-slate-400"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                className="h-11 w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:from-teal-400 hover:to-emerald-400"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/20" />
                <span className="text-xs text-slate-300">or</span>
                <div className="h-px flex-1 bg-white/20" />
              </div>

              <p className="text-center text-sm text-slate-300">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
  glow,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  glow: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-blue-500/10">
      <div
        className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${glow} ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>

      <p className="text-base font-bold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
    </div>
  );
}

export default Login;