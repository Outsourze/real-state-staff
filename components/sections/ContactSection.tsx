"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialLinks } from "@/components/ui/SocialLinks";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  LoaderCircle,
} from "lucide-react";
import {
  CONTACT_ROLES,
  contactSchema,
  formatEnquiry,
  type ContactValues,
} from "@/lib/contact-schema";

type SubmissionState = {
  kind: "idle" | "success" | "error" | "unavailable";
  message: string;
};

const initialValues = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  website: "",
};
const inputClass =
  "mt-2 block min-h-12 w-full scroll-mt-32 rounded-[4px] border border-[#6f897d] bg-white px-3.5 py-3 text-base text-[var(--color-heading)] transition-colors placeholder:text-[#536b62] hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-2 focus:outline-offset-3 focus:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-70 aria-[invalid=true]:border-[#923a32]";
const labelClass = "block text-base font-semibold text-[var(--color-heading)]";
const errorClass = "mt-2 text-base leading-relaxed text-[#923a32]";

const formFields = [
  { name: "fullName", id: "contact-name", label: "Full name" },
  { name: "email", id: "contact-email", label: "Email address" },
  { name: "company", id: "contact-company", label: "Company / agency" },
  { name: "phone", id: "contact-phone", label: "Phone number" },
  { name: "role", id: "contact-role", label: "Role needed" },
  { name: "message", id: "contact-message", label: "How can we help?" },
] as const;

export function ContactSection({
  variant = "home",
  introduction,
  className = "",
}: {
  variant?: "home" | "page";
  introduction?: ReactNode;
  className?: string;
}) {
  const [submission, setSubmission] = useState<SubmissionState>({
    kind: "idle",
    message: "",
  });
  const [unsentEnquiry, setUnsentEnquiry] = useState<ContactValues | null>(
    null,
  );
  const [copyMessage, setCopyMessage] = useState("");
  const [invalidSubmissionCount, setInvalidSubmissionCount] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const pendingSubmissionRef = useRef<{
    body: string;
    key: string;
    createdAt: number;
  } | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialValues,
    mode: "onBlur",
    shouldFocusError: false,
  });
  const invalidFields = formFields.flatMap((field) => {
    const message = errors[field.name]?.message;
    return message ? [{ ...field, message }] : [];
  });

  useEffect(() => {
    function selectRole(event: Event) {
      const role: unknown = (event as CustomEvent<unknown>).detail;
      const matchingRole = CONTACT_ROLES.find((item) => item === role);
      if (matchingRole)
        setValue("role", matchingRole, {
          shouldValidate: true,
          shouldDirty: true,
        });
    }
    window.addEventListener("select-role", selectRole);
    return () => window.removeEventListener("select-role", selectRole);
  }, [setValue]);

  useEffect(() => {
    if (submission.kind !== "idle") statusRef.current?.focus();
  }, [submission]);

  useEffect(() => {
    if (invalidSubmissionCount > 0) errorSummaryRef.current?.focus();
  }, [invalidSubmissionCount]);

  async function onSubmit(values: ContactValues) {
    setInvalidSubmissionCount(0);
    setSubmission({ kind: "idle", message: "" });
    setCopyMessage("");
    setUnsentEnquiry(values);
    const body = JSON.stringify(values);
    const pending = pendingSubmissionRef.current;
    // Reuse the key for unchanged retries within Resend's 24-hour window.
    const submission =
      !pending ||
      pending.body !== body ||
      Date.now() - pending.createdAt >= 24 * 60 * 60 * 1000
        ? {
            body,
            key: crypto.randomUUID(),
            createdAt: Date.now(),
          }
        : pending;
    pendingSubmissionRef.current = submission;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submission.key,
        },
        body,
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      const payload =
        result && typeof result === "object"
          ? (result as Record<string, unknown>)
          : {};
      const message =
        typeof payload.message === "string"
          ? payload.message
          : "We could not confirm delivery. Please save a copy and try again later.";

      if (response.ok && payload.code === "received") {
        setSubmission({ kind: "success", message });
        setUnsentEnquiry(null);
        pendingSubmissionRef.current = null;
        reset();
      } else {
        setSubmission({
          kind: payload.code === "not_connected" ? "unavailable" : "error",
          message,
        });
      }
    } catch {
      setSubmission({
        kind: "error",
        message:
          "We could not confirm delivery. Your details are still here. Please save a copy and check with the team before trying again.",
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  async function copyEnquiry() {
    if (!unsentEnquiry) return;
    try {
      await navigator.clipboard.writeText(formatEnquiry(unsentEnquiry));
      setCopyMessage(
        "Copied to your clipboard. Your enquiry has not been sent by copying it.",
      );
    } catch {
      setCopyMessage(
        "Clipboard access is unavailable. Use Download enquiry to save your details instead.",
      );
    }
  }

  function downloadEnquiry() {
    if (!unsentEnquiry) return;
    const url = URL.createObjectURL(
      new Blob([formatEnquiry(unsentEnquiry)], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "real-estate-staff-enquiry.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyMessage(
      "A local copy has been downloaded. Downloading does not send your enquiry.",
    );
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={`bg-[var(--color-background)] py-16 md:py-20 lg:py-24 ${variant === "home" ? "border-t border-[var(--color-border)]" : ""} ${className}`}
    >
      <div className="site-container grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="contact-introduction lg:pt-5">
          {introduction ?? (
            <>
              <p className="eyebrow">
                {variant === "page"
                  ? "YOUR NEXT STEP"
                  : "LET’S BUILD YOUR TEAM"}
              </p>
              <h2
                id="contact-heading"
                className="section-heading mt-5 max-w-md"
              >
                {variant === "page"
                  ? "Tell us what your team needs."
                  : "The right support starts with a conversation."}
              </h2>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-[1.75] text-[var(--color-text)]">
                Tell us a little about your agency and where you need a hand.
                We’ll help you find the right people to move your business
                forward.
              </p>
              <ul className="mt-8 space-y-4 text-base leading-relaxed text-[var(--color-heading)]">
                {[
                  "Real estate experience, from day one",
                  "A dedicated professional, part of your team",
                  "Support that grows with your business",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check
                      size={20}
                      strokeWidth={1.6}
                      className="mt-0.5 shrink-0 text-[var(--color-primary)]"
                      aria-hidden="true"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 max-w-sm border-t border-[var(--color-border)] pt-6 lg:mt-14">
                <p className="text-base font-semibold tracking-[0.08em] text-[var(--color-heading)] uppercase">
                  YOUR NEXT CHAPTER, TOGETHER.
                </p>
                <p className="mt-3 text-base leading-relaxed text-[var(--color-text)]">
                  One person or a whole team. Let’s find what works for you.
                </p>
              </div>
              <div className="mt-8">
                <h3 className="mb-4 text-base font-semibold text-[var(--color-heading)]">
                  Connect with us
                </h3>
                <SocialLinks />
              </div>
            </>
          )}
        </div>

        <form
          id="staffing-enquiry"
          action="/api/contact"
          method="post"
          onSubmit={(event) => {
            void handleSubmit(onSubmit, () => {
              setSubmission({ kind: "idle", message: "" });
              setInvalidSubmissionCount((count) => count + 1);
            })(event);
          }}
          noValidate
          aria-busy={isSubmitting}
          aria-label={variant === "page" ? undefined : "Staffing enquiry"}
          aria-labelledby={
            variant === "page" ? "enquiry-form-heading" : undefined
          }
          className="min-w-0 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 lg:p-9"
        >
          {variant === "page" && (
            <div className="mb-6 border-b border-[var(--color-border)] pb-6">
              <h2
                id="enquiry-form-heading"
                className="text-[1.625rem] font-semibold leading-snug tracking-[-0.025em] text-[var(--color-heading)]"
              >
                Tell us about your agency.
              </h2>
              <p className="mt-3 text-base leading-relaxed">
                A few details will help us understand the support you’re looking
                for.
              </p>
            </div>
          )}
          <p className="mb-6 text-base leading-relaxed text-[var(--color-text)]">
            Fields marked <span aria-hidden="true">*</span>
            <span className="sr-only">with an asterisk</span> are required.
          </p>
          {invalidSubmissionCount > 0 && invalidFields.length > 0 && (
            <div
              id="contact-error-summary"
              ref={errorSummaryRef}
              tabIndex={-1}
              aria-labelledby="contact-error-summary-heading"
              role="alert"
              className="mb-7 scroll-mt-32 rounded-[4px] border-2 border-[#923a32] bg-white p-5 text-base leading-relaxed text-[#923a32] focus:outline-2 focus:outline-offset-4 focus:outline-[var(--color-primary)]"
            >
              <h3 id="contact-error-summary-heading" className="font-semibold">
                Please check your enquiry
              </h3>
              <p className="mt-2">
                Correct the following fields, then send again.
              </p>
              <ul className="mt-3 space-y-1">
                {invalidFields.map(({ name, id, label, message }) => (
                  <li key={name}>
                    <a
                      href={`#${id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        setFocus(name);
                      }}
                      className="inline-flex min-h-11 items-center underline underline-offset-4"
                    >
                      {label}: {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <fieldset
            disabled={isSubmitting}
            className="grid min-w-0 gap-x-5 gap-y-6 sm:grid-cols-2"
          >
            <legend className="sr-only">
              Tell us about your staffing needs
            </legend>
            <div>
              <label htmlFor="contact-name" className={labelClass}>
                Full name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "contact-name-error" : undefined
                }
                className={inputClass}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p id="contact-name-error" className={errorClass}>
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@youragency.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                className={inputClass}
                {...register("email")}
              />
              {errors.email && (
                <p id="contact-email-error" className={errorClass}>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-company" className={labelClass}>
                Company / agency <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-company"
                autoComplete="organization"
                required
                maxLength={160}
                placeholder="Your agency name"
                aria-invalid={Boolean(errors.company)}
                aria-describedby={
                  errors.company ? "contact-company-error" : undefined
                }
                className={inputClass}
                {...register("company")}
              />
              {errors.company && (
                <p id="contact-company-error" className={errorClass}>
                  {errors.company.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-phone" className={labelClass}>
                Phone number{" "}
                <span className="font-normal text-[var(--color-text)]">
                  (optional)
                </span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder="Including country code"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "contact-phone-error" : undefined
                }
                className={inputClass}
                {...register("phone")}
              />
              {errors.phone && (
                <p id="contact-phone-error" className={errorClass}>
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-role" className={labelClass}>
                Role needed <span aria-hidden="true">*</span>
              </label>
              <select
                id="contact-role"
                required
                defaultValue=""
                aria-invalid={Boolean(errors.role)}
                aria-describedby={
                  errors.role ? "contact-role-error" : undefined
                }
                className={`${inputClass} cursor-pointer pr-8`}
                {...register("role")}
              >
                <option value="" disabled>
                  Select the support you’re looking for
                </option>
                {CONTACT_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p id="contact-role-error" className={errorClass}>
                  {errors.role.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className={labelClass}>
                How can we help? <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                minLength={10}
                maxLength={4000}
                placeholder="Tell us about your team, the support you need, and any questions you have."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`}
                className={`${inputClass} min-h-28 resize-y leading-relaxed`}
                {...register("message")}
              />
              <p
                id="contact-message-hint"
                className="mt-2 text-base leading-relaxed text-[var(--color-text)]"
              >
                10–4,000 characters. Please avoid confidential client or tenant
                information.
              </p>
              {errors.message && (
                <p id="contact-message-error" className={errorClass}>
                  {errors.message.message}
                </p>
              )}
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field blank</label>
              <input
                id="contact-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>
          </fieldset>

          <p className="mt-6 text-base leading-[1.8] text-[var(--color-text)]">
            By sending this enquiry, you agree to us contacting you about your
            staffing needs. Read our{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-3 hover:text-[var(--color-primary)]"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="button group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[4px] border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#003024] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
                Sending enquiry
              </>
            ) : (
              <>
                Let’s talk{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </>
            )}
          </button>

          {submission.kind !== "idle" && (
            <div
              ref={statusRef}
              tabIndex={-1}
              role={submission.kind === "success" ? "status" : "alert"}
              className={`mt-6 scroll-mt-32 rounded-[4px] border p-5 text-base leading-relaxed focus:outline-2 focus:outline-offset-4 focus:outline-[var(--color-primary)] ${submission.kind === "success" ? "border-[#a5b9ae] bg-[#e7efe8] text-[var(--color-heading)]" : "border-[#d5c9a9] bg-[#f6f2e6] text-[#605130]"}`}
            >
              <p className="flex items-start gap-2.5">
                {submission.kind === "success" && (
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                {submission.message}
              </p>
              {unsentEnquiry && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                  <button
                    type="button"
                    onClick={copyEnquiry}
                    className="inline-flex min-h-11 items-center gap-2 text-base font-semibold underline underline-offset-4"
                  >
                    <Copy size={14} aria-hidden="true" />
                    Copy enquiry
                  </button>
                  <button
                    type="button"
                    onClick={downloadEnquiry}
                    className="inline-flex min-h-11 items-center gap-2 text-base font-semibold underline underline-offset-4"
                  >
                    <ArrowDownToLine size={14} aria-hidden="true" />
                    Download enquiry
                  </button>
                </div>
              )}
              {copyMessage && (
                <p className="mt-3 text-base" role="status">
                  {copyMessage}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
