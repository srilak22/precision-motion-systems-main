import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookingManagementDashboard } from "@/components/admin/BookingManagementDashboard";
import { verifyDashboardAccess } from "@/lib/auth";
import { buildSeoMeta } from "@/lib/seo";
import { Lock, ArrowRight, Shield, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/intelligence/bookings")({
  head: () =>
    buildSeoMeta({
      title: "Consultation Bookings Management | INDUS Command Center",
      description: "Secure management dashboard for robotics consultations and calendar appointments.",
      path: "/intelligence/bookings",
      noindex: true,
    }),
  component: AdminBookingsPage,
});

function AdminBookingsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/indus_admin_token=([^;]+)/);
      const token = match ? match[1] : "";
      if (token) {
        verifyDashboardAccess({ data: token })
          .then((res) => {
            if (res.authorized) {
              setIsAuthorized(true);
            }
          })
          .catch(() => {})
          .finally(() => setChecking(false));
      } else {
        setChecking(false);
      }
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Verifying Administrator Privileges...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <section className="technical-grid border-b border-border/40 bg-surface-dark px-5 py-8 text-surface-foreground lg:px-10">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/intelligence"
                className="text-xs font-bold uppercase tracking-wider text-surface-foreground/60 hover:text-signal"
              >
                Intelligence Hub
              </Link>
              <span className="text-surface-foreground/40">/</span>
              <span className="text-xs uppercase tracking-wider text-signal font-bold">
                Consultation Bookings
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
              Robotics Consultation Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-none border-border text-xs font-bold uppercase"
            >
              <Link to="/book-consultation">
                <CalendarCheck size={13} className="mr-1.5 text-signal" />
                Live Client Booking Page
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-5 py-10 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          {isAuthorized ? (
            <BookingManagementDashboard />
          ) : (
            <div className="mx-auto max-w-lg border border-border bg-card p-8 sm:p-10 text-center space-y-5 shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border border-signal/40 bg-signal/10 text-signal">
                <Lock size={26} />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  Restricted Administrator Access
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  The Consultation Management Dashboard contains sensitive client specifications,
                  bilateral NDAs, and live Google Calendar mutation endpoints. Please sign in to proceed.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full rounded-none bg-signal text-xs font-bold uppercase text-signal-foreground hover:bg-signal/90"
                >
                  <Link to="/login">
                    Sign In as Administrator
                    <ArrowRight size={13} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
