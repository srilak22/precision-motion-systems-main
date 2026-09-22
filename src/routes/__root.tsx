import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ArrowRight, Search, MessageSquare, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ModalProvider, useModals } from "@/components/modals/ModalContext";
import { GlobalModals } from "@/components/modals/GlobalModals";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageQuickBar } from "@/components/layout/PageQuickBar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { RoboticsAssistant } from "@/components/chatbot/RoboticsAssistant";
import { companyConfig } from "@/data/config";

// Professional 404 Component (Section 49)
function NotFoundComponent() {
  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg border border-border bg-card p-8 text-center sm:p-12 shadow-xl">
        <span className="font-display text-7xl font-bold text-signal">404</span>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you're looking for may have moved, been renamed, or no longer exists on the INDUS digital engineering platform.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90">
            <Link to="/">
              <Home size={14} className="mr-1.5" /> Back to Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-none border-border font-bold uppercase">
            <Link to="/products">
              Explore Products <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-none border-border font-bold uppercase">
            <Link to="/search">
              <Search size={14} className="mr-1.5" /> Search
            </Link>
          </Button>

          <Button variant="outline" onClick={handleWhatsApp} className="rounded-none border-border font-bold uppercase">
            <MessageSquare size={14} className="mr-1.5 text-signal" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

// Professional Error Component (Section 50)
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  const handleWhatsApp = () => {
    window.open(companyConfig.getWhatsAppUrl({ type: "general" }), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg border border-destructive/40 bg-card p-8 text-center sm:p-12 shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center bg-destructive/15 text-destructive">
          <AlertTriangle size={28} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
          System Execution Error
        </h1>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          An unexpected exception occurred while rendering this page component. You can reload the view or contact our engineering support team.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
          >
            Try Again
          </Button>
          <Button asChild variant="outline" className="rounded-none border-border font-bold uppercase">
            <a href="/">Go Home</a>
          </Button>
          <Button variant="outline" onClick={handleWhatsApp} className="rounded-none border-border font-bold uppercase">
            <MessageSquare size={14} className="mr-1.5 text-signal" /> WhatsApp Support
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "INDUS Industrial Robotics — Precision Motion & Automation Technology" },
      {
        name: "description",
        content:
          "INDUS Industrial Robotics delivers robotic components, precision reducers, actuators, motion control, and connected automation platforms for manufacturing.",
      },
      { name: "author", content: "INDUS Industrial Robotics" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-signal selection:text-signal-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <div className="flex min-h-screen flex-col">
          {/* Site-wide Sticky Header */}
          <Header />

          {/* Contextual Clickable Breadcrumbs */}
          <Breadcrumbs />

          {/* Main Content Viewport */}
          <main className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>

          {/* Page-level Subtle Contact Strip (Desktop) & Sticky Conversion Bar (Mobile) */}
          <PageQuickBar />

          {/* Site-wide Mega Footer */}
          <Footer />

          {/* Floating Contextual WhatsApp Action Button */}
          <WhatsAppButton />

          {/* Interactive Guided Robotics Assistant */}
          <RoboticsAssistant />

          {/* Global Accessible Modal Dialogs */}
          <GlobalModals />
        </div>
      </ModalProvider>
    </QueryClientProvider>
  );
}
