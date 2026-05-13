"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StudioLoading } from "@/components/StudioLoading";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/studio");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isAuthenticated) return <StudioLoading />;

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/studio");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">
            <Image src="/logo.png" width={40} height={40} alt="Chitra" priority />
          </span>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your Chitra Studio account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {serverError ? <div className="form-error-banner">{serverError}</div> : null}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className={`form-input${fieldErrors.email ? " error" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
                setServerError("");
              }}
              autoComplete="email"
              autoFocus
            />
            {fieldErrors.email ? (
              <span className="field-error">{fieldErrors.email}</span>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-with-toggle">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input${fieldErrors.password ? " error" : ""}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                  setServerError("");
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password ? (
              <span className="field-error">{fieldErrors.password}</span>
            ) : null}
            <div className="form-field-footer">
              <Link href="/forgot-password" className="field-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">
            {"Don't have an account? "}
            <Link href="/forgot-password" className="auth-link">Get started</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
