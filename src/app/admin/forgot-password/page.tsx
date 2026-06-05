"use client";

import { useActionState, startTransition } from "react";
import { Terminal, Mail, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

const initialState = {
  error: "",
  success: false,
};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  if (state?.success) {
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

          {/* Success Card */}
          <div className="glass-card rounded-3xl border border-white/[0.08] p-8 sm:p-10 relative overflow-hidden bg-obsidian-950/40 backdrop-blur-xl shadow-2xl">
            {/* Inner backglow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-3xl -z-10" />

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-pink/30 flex items-center justify-center border border-neon-purple/50">
                <CheckCircle className="w-8 h-8 text-neon-purple" />
              </div>

              <h2 className="text-lg font-bold font-display text-white">
                Password Reset Sent
              </h2>

              <p className="text-sm text-gray-400 leading-relaxed">
                A password reset link has been sent to your email address. Please check your inbox and follow the link to reset your password.
              </p>

              <div className="w-full pt-4 flex flex-col gap-3">
                <Link
                  href="/admin/login"
                  className="w-full relative group overflow-hidden py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 active:scale-[0.99] transition-all duration-300"
                >
                  Return to Login
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors"
                >
                  ← Return to main portfolio
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
            Reset Your Password
          </h2>

          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={isPending}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm bg-black/45 border border-white/[0.06] text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)] transition-all duration-300 disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              </div>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
                ⚠️ {state.error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all duration-300 cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
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
