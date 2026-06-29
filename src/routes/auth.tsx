import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const nav = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) nav({ to: "/admin" });
  }, [loading, session, isAdmin, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        nav({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--ink)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 20% 20%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(500px circle at 80% 80%, rgba(2,132,199,0.15), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <i className="fa-solid fa-arrow-left" /> Back to site
        </Link>
        <div className="card-dark !p-8 backdrop-blur-xl border-white/10">
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand)] text-white text-xl font-bold shadow-[0_10px_40px_rgba(14,165,233,0.4)] mb-4">
              SJ
            </div>
            <h1 className="text-2xl font-bold text-white">
              {mode === "login" ? "Admin Sign In" : "Create Admin Account"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode === "login"
                ? "Access your dashboard"
                : "Use your registered admin email"}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="form-field-wrap">
              <i className="field-icon fa-regular fa-envelope" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-field"
                autoComplete="email"
              />
            </div>
            <div className="form-field-wrap">
              <i className="field-icon fa-solid fa-lock" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-field"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-brand w-full justify-center !py-3 disabled:opacity-60"
            >
              {busy ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : mode === "login" ? (
                <>Sign In <i className="fa-solid fa-arrow-right" /></>
              ) : (
                <>Create Account <i className="fa-solid fa-user-plus" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button onClick={() => setMode("signup")} className="text-[var(--brand)] hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-[var(--brand)] hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
