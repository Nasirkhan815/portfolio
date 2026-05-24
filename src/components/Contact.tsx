"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import Magnetic from "./Magnetic";
import { submitContactMessage } from "@/app/admin/dashboard/messages/actions";
import { createClient } from "@/utils/supabase/client";


interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [settings, setSettings] = useState({
    email: "nasir.khan815@gmail.com",
    whatsapp_url: "https://wa.me/923459037885",
    linkedin_url: "https://www.linkedin.com/in/nasirkhan-uiux/",
    github_url: "https://github.com",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSettings({
            email: data.email || "nasir.khan815@gmail.com",
            whatsapp_url: data.whatsapp_url || "https://wa.me/923459037885",
            linkedin_url: data.linkedin_url || "https://www.linkedin.com/in/nasirkhan-uiux/",
            github_url: data.github_url || "https://github.com",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.name.trim()) tempErrors.name = "Full Name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Please input a valid email address";
    }
    if (!form.subject.trim()) tempErrors.subject = "Subject is required";
    if (!form.message.trim()) tempErrors.message = "Message text is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const triggerShake = () => {
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      const res = await submitContactMessage(null, formData);

      if (res && !res.success) {
        setErrors({ message: res.error || "Failed to transmit message." });
        triggerShake();
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Dynamic Confetti Explosion on Success!
      confetti({
        particleCount: 150,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#ec4899", "#06b6d4"],
      });
    } catch (err: any) {
      console.error(err);
      setErrors({ message: "A network transmission error occurred." });
      triggerShake();
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 overflow-hidden bg-obsidian-900/20"
    >
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-30" />

      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/10 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[120px] -z-10 animate-pulse duration-[7000ms]" />
      <div className="absolute bottom-1/10 right-1/10 w-[30rem] h-[30rem] bg-neon-blue/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-widest text-neon-purple uppercase mb-3"
          >
            Get in touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white"
          >
            Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Together</span>
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white mb-4 leading-tight">
                  Let’s build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">premium digital experience</span> together.
                </h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm sm:text-base">
                  Have an exciting project idea, dynamic collaboration proposal, or need high-fidelity CGI & UX architectures? Get in touch via any of the channels below or send a secure transmission form.
                </p>
              </div>

              {/* Action Buttons list */}
              <div className="flex flex-col gap-4 w-full sm:max-w-md">

                {/* Email Button */}
                <Magnetic>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-neon-purple/40 hover:bg-white/[0.04] transition-all duration-300 group w-full text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:scale-105 transition-transform duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">Direct Email</h4>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-purple transition-colors">{settings.email}</span>
                    </div>
                  </a>
                </Magnetic>

                {/* WhatsApp Button */}
                <Magnetic>
                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-neon-emerald/40 hover:bg-white/[0.04] transition-all duration-300 group w-full text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center text-neon-emerald group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">WhatsApp Chat</h4>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-emerald transition-colors">Start Conversation</span>
                    </div>
                  </a>
                </Magnetic>

                {/* LinkedIn Button */}
                <Magnetic>
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-neon-blue/40 hover:bg-white/[0.04] transition-all duration-300 group w-full text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue group-hover:scale-105 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">Professional Network</h4>
                      <span className="text-sm font-semibold text-white group-hover:text-neon-blue transition-colors">Nasir Khan LinkedIn</span>
                    </div>
                  </a>
                </Magnetic>

              </div>

            </motion.div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              animate={shakeTrigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              className="glass-card rounded-2xl border border-white/[0.08] p-6 sm:p-10 relative overflow-hidden"
            >
              {/* Backglow panel inside */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.005] to-white/[0.02] rounded-2xl -z-10" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      {/* Name Field */}
                      <div className="flex flex-col text-left">
                        <label htmlFor="name" className="text-xs font-semibold text-gray-400 mb-2">
                          Your Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3.5 rounded-xl text-sm bg-black/45 border text-white placeholder-gray-600 focus:outline-none transition-all duration-300 ${errors.name
                                ? "border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                                : "border-white/[0.06] focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)]"
                              }`}
                          />
                          {errors.name && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 flex items-center gap-1 text-[10px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        {errors.name && <p className="text-[10px] text-red-400 mt-1.5">{errors.name}</p>}
                      </div>

                      {/* Email Field */}
                      <div className="flex flex-col text-left">
                        <label htmlFor="email" className="text-xs font-semibold text-gray-400 mb-2">
                          Your Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3.5 rounded-xl text-sm bg-black/45 border text-white placeholder-gray-600 focus:outline-none transition-all duration-300 ${errors.email
                                ? "border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                                : "border-white/[0.06] focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)]"
                              }`}
                          />
                          {errors.email && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 flex items-center gap-1 text-[10px]">
                              <AlertCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        {errors.email && <p className="text-[10px] text-red-400 mt-1.5">{errors.email}</p>}
                      </div>

                    </div>

                    {/* Subject Field */}
                    <div className="flex flex-col text-left">
                      <label htmlFor="subject" className="text-xs font-semibold text-gray-400 mb-2">
                        Subject
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleInputChange}
                          placeholder="Project Partnership Collaboration"
                          className={`w-full px-4 py-3.5 rounded-xl text-sm bg-black/45 border text-white placeholder-gray-600 focus:outline-none transition-all duration-300 ${errors.subject
                              ? "border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                              : "border-white/[0.06] focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)]"
                            }`}
                        />
                        {errors.subject && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 flex items-center gap-1 text-[10px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      {errors.subject && <p className="text-[10px] text-red-400 mt-1.5">{errors.subject}</p>}
                    </div>

                    {/* Message Field */}
                    <div className="flex flex-col text-left">
                      <label htmlFor="message" className="text-xs font-semibold text-gray-400 mb-2">
                        Your Message
                      </label>
                      <div className="relative">
                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleInputChange}
                          rows={5}
                          placeholder="Tell me more about your requirements..."
                          className={`w-full px-4 py-3.5 rounded-xl text-sm bg-black/45 border text-white placeholder-gray-600 focus:outline-none transition-all duration-300 resize-none ${errors.message
                              ? "border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
                              : "border-white/[0.06] focus:border-neon-purple/50 focus:shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)]"
                            }`}
                        />
                        {errors.message && (
                          <span className="absolute right-3 top-4 text-red-400 flex items-center gap-1 text-[10px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      {errors.message && <p className="text-[10px] text-red-400 mt-1.5">{errors.message}</p>}
                    </div>

                    {/* General Error Banner */}
                    {errors.message && (
                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-medium leading-relaxed">
                        ⚠️ {errors.message}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-neutral-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/20 hover:shadow-neon-purple/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:hover:shadow-none transition-all duration-300 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                  </motion.form>
                ) : (
                  // Success Message Panel
                  <motion.div
                    key="success-card"
                    className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {/* Glowing Check Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)]"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold font-display text-white mb-2">
                        Message Received Successfully
                      </h3>
                      <p className="text-gray-400 font-light text-sm max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out, Nasir Khan has received your signal. Expect a transmission reply in your mailbox within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="px-6 py-2.5 rounded-full border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
