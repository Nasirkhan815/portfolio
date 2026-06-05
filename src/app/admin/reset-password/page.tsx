"use client";

import { useEffect, useState } from "react";
import { useActionState, startTransition } from "react";
import { Terminal, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { updatePassword } from "./actions";
import { createClient } from "@/lib/supabase/client";

const initialState = {
  error: "",
};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setSessionValid(true);
      } else {
        setSessionValid(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handlePasswordChange = () => {
    setPasswordsMatch(true);
  };

  // Show loading state while checking session
  if (sessionValid === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#050508] px-4 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern -z-20 opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-neon-purple/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-neon-pink/5 rounded-full blur-[100px] -z-10" />

        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-3xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden bg-obsidian-950/40 backdrop-blur-xl shadow-2xl flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
          </div>
        </div>
      </div>
    );
  }

  // Show error if session is invalid
  if (!sessionValid) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#050508] px-4 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern -z-20 opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-neon-purple/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-neon-pink/5 rounded-full blur-[100px] -z-10" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-16 h-16 flex items-center justify-center shadow-2xl shadow-neon-purple/20 p-1 bg-obsidian-950/40 rounded-2xl border border-white/[0.06] mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                sizes="64px"
                className="object-contain p-1.5"
                priority
              />
            </div>
            <h1 className="font-display text-xl font-black tracking-widest text-white uppercase">
              Nasir Khan
            </h1>
            <span className="text-[10px] font-mono tracking-widest text-neon-purple mt-1 flex items-center gap-1.5 uppercase">
              <Terminal className="w-3.5 h-3.5" /> Security Access Terminal
            </span>
          </div>

          {/* Error Card */}
          <div className="glass-card rounded-3xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden bg-obsidian-950/40 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-3xl -z-10" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-950/30 flex items-center justify-center border border-red-500/50">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>

              <h2 className="text-lg font-bold font-display text-white">
                Invalid Reset Link
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed">
                This password reset link has expired or is invalid. Please request a new reset link to continue.
              </p>

              <div className="w-full pt-4 flex flex-col gap-3">
                <Link
                  href="/admin/forgot-password"
                  className="w-full relative group overflow-hidden py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 active:scale-[0.99] transition-all duration-300"
                >
                  Request New Reset Link
                </Link>

                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050508] px-4 overflow-hidden">
      {/* Background Gradients and Glowing Mesh Orbs */}
      <div className="absolute inset-0 bg-dot-pattern -z-20 opacity-30" />

      {/* Dynamic Purple Orb */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-neon-purple/10 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
      {/* Dynamic Pink Orb */}
      <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-neon-pink/5 rounded-full blur-[100px] -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 flex items-center justify-center shadow-2xl shadow-neon-purple/20 p-1 bg-obsidian-950/40 rounded-2xl border border-white/[0.06] mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              sizes="64px"
              className="object-contain p-1.5"
              priority
            />
          </div>
          <h1 className="font-display text-xl font-black tracking-widest text-white uppercase">
            Nasir Khan
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-neon-purple mt-1 flex items-center gap-1.5 uppercase">
            <Terminal className="w-3.5 h-3.5" /> Security Access Terminal
          </span>
        </div>

        {/* Glassmorphic Card */}
        <div className="glass-card rounded-3xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden bg-obsidian-950/40 backdrop-blur-xl shadow-2xl">
          {/* Inner backglow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-3xl -z-10" />

          <h2 className="text-lg font-bold font-display text-white text-left mb-3">
            Create New Password
          </h2>

          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please enter your new password below. It must be at least 8 characters long.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* New Password Field */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-gray-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  disabled={isPending}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm bg-black/45 border border-white/[0.06] text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)] transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-400">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  disabled={isPending}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl text-sm bg-black/45 border border-white/[0.06] text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)] transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password Mismatch Error */}
            {!passwordsMatch && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
                ⚠️ Passwords do not match.
              </div>
            )}

            {/* Other Errors */}
            {state?.error && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
                ⚠️ {state.error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !passwordsMatch}
              className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all duration-300 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-white/[0.06] to-transparent" />
          </div>

          {/* Back to Login */}
          <Link
            href="/admin/login"
            className="text-center text-xs text-gray-500 hover:text-white transition-colors font-medium inline-block w-full"
          >
            ← Back to login
          </Link>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors"
          >
            ← Return to main portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
