"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFieldError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFieldError("Enter a valid email address.");
      return false;
    }
    setFieldError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const message = await forgotPassword(email.trim());
      setSuccessMessage(message);
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo success-logo">
              <CheckCircle2 size={36} strokeWidth={1.8} />
            </span>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">{successMessage}</p>
          </div>

          <div className="sent-message-card">
            <Mail size={20} strokeWidth={1.5} />
            <div>
              <strong>We sent an email to</strong>
              <span>{email}</span>
            </div>
          </div>

          <div className="auth-footer">
            <Link href="/login" className="auth-link back-link">
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">
            <Image src="/logo.png" width={40} height={40} alt="Chitra" priority />
          </span>
          <h1 className="auth-title">Forgot password</h1>
          <p className="auth-subtitle">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {serverError ? <div className="form-error-banner">{serverError}</div> : null}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className={`form-input${fieldError ? " error" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldError("");
                setServerError("");
              }}
              autoComplete="email"
              autoFocus
            />
            {fieldError ? <span className="field-error">{fieldError}</span> : null}
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="spinner" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login" className="auth-link back-link">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
