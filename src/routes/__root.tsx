import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { type ReactNode, useEffect, useRef } from "react";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { resolvePrivacySafeGeo } from "@/lib/intelligence/tracker";

import { ArrowRight, Search, MessageSquare, AlertTriangle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

import appCss from "../styles.css?url";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { initClarity, trackClarityEvent } from "../analytics/clarity";



import { ModalProvider } from "@/components/modals/ModalContext";

import { GlobalModals } from "@/components/modals/GlobalModals";

import { Header } from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

import { PageQuickBar } from "@/components/layout/PageQuickBar";

import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

import { PrecisionAssistant } from "@/components/chatbot/PrecisionAssistant";

import { companyConfig } from "@/data/config";

/* =====================================================
   PROFESSIONAL 404 COMPONENT
===================================================== */

function NotFoundComponent() {
  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "general",
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg border border-border bg-card p-8 text-center shadow-xl sm:p-12">
        <span className="font-display text-7xl font-bold text-signal">404</span>

        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you're looking for may have moved, been renamed, or no longer exists on the INDUS
          digital engineering platform.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="rounded-none bg-signal font-bold uppercase text-signal-foreground hover:bg-signal/90"
          >
            <Link to="/">
              <Home size={14} className="mr-1.5" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-none border-border font-bold uppercase"
          >
            <Link to="/products">
              Explore Products
              <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-none border-border font-bold uppercase"
          >
            <Link to="/search">
              <Search size={14} className="mr-1.5" />
              Search
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="rounded-none border-border font-bold uppercase"
          >
            <MessageSquare size={14} className="mr-1.5 text-signal" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   PROFESSIONAL ERROR COMPONENT
===================================================== */

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  const handleWhatsApp = () => {
    window.open(
      companyConfig.getWhatsAppUrl({
        type: "general",
      }),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg border border-destructive/40 bg-card p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center bg-destructive/15 text-destructive">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
          System Execution Error
        </h1>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          An unexpected exception occurred while rendering this page component. You can reload the
          view or contact our engineering support team.
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

          <Button
            asChild
            variant="outline"
            className="rounded-none border-border font-bold uppercase"
          >
            <a href="/">Go Home</a>
          </Button>

          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="rounded-none border-border font-bold uppercase"
          >
            <MessageSquare size={14} className="mr-1.5 text-signal" />
            WhatsApp Support
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   ROOT ROUTE
===================================================== */

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },

      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        title: "INDUS Industrial Robotics — Precision Motion & Automation Technology",
      },

      {
        name: "description",
        content:
          "INDUS Industrial Robotics delivers robotic components, precision reducers, actuators, motion control, and connected automation platforms for manufacturing.",
      },

      {
        name: "author",
        content: "INDUS Industrial Robotics",
      },

      {
        property: "og:type",
        content: "website",
      },

      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },

      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },

      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },

      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },

      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  }),

  shellComponent: RootShell,

  component: RootComponent,

  notFoundComponent: NotFoundComponent,

  errorComponent: ErrorComponent,
});

/* =====================================================
   ROOT SHELL
===================================================== */

function RootShell({ children }: { children: ReactNode }) {
  const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID || "ysb67jrgfu";

  return (
    <html lang="en">
      <head>
        <HeadContent />
        {clarityProjectId && (
          <script
            id="clarity-script"
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;t.id="clarity-script";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityProjectId}");
if (typeof window !== "undefined" && typeof window.clarity === "function") {
  window.clarity("consent");
  window.clarity("set", "platform", "production");
}`,
            }}
          />
        )}
      </head>

      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-signal selection:text-signal-foreground">
        {children}

        <Scripts />
      </body>
    </html>
  );
}

/* =====================================================
   ROOT COMPONENT
   DIGITAL PRESENCE TRACKING
===================================================== */

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const prevPathRef = useRef<string>("");

  // 0. INITIALIZE MICROSOFT CLARITY
  useEffect(() => {
    initClarity();
  }, []);

  // 1. PAGE VIEW + SESSION START TRACKING
  useEffect(() => {
    if (typeof window === "undefined") return;
    resolvePrivacySafeGeo();
    const currentPath = location.pathname;
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      trackDigitalPresence("page_view", "page", currentPath);

      const sessionStarted = sessionStorage.getItem("indus_session_started");
      if (!sessionStarted) {
        trackDigitalPresence("session_start", "session", "New website session");
        sessionStorage.setItem("indus_session_started", "true");
      }

      // Microsoft Clarity Route Tracking & Category-level views
      trackClarityEvent("page_view");
      if (currentPath.startsWith("/products")) {
        trackClarityEvent("product_view");
      } else if (currentPath.startsWith("/solutions")) {
        trackClarityEvent("solution_view");
      } else if (currentPath.startsWith("/applications")) {
        trackClarityEvent("application_view");
      } else if (currentPath.startsWith("/contact")) {
        trackClarityEvent("contact_us");
      }
    }
  }, [location.pathname]);

  // 2. CLICK & INTERACTION TRACKING
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], input[type='submit']") as HTMLElement | null;
      if (!interactive) return;

      const label = (interactive.textContent || "").trim().replace(/\s+/g, " ").substring(0, 150);
      const href = interactive instanceof HTMLAnchorElement ? interactive.href : interactive.getAttribute("href") || "";
      const text = `${label} ${href}`.toLowerCase();

      // WhatsApp Contact
      if (text.includes("whatsapp") || text.includes("wa.me")) {
        trackDigitalPresence("contact", label || "WhatsApp", href || "WhatsApp action");
        trackClarityEvent("whatsapp_click");
        return;
      }

      // Phone Contact
      if (href.startsWith("tel:") || text.includes("call us")) {
        trackClarityEvent("phone_click");
      }

      // Email Contact
      if (href.startsWith("mailto:")) {
        trackClarityEvent("email_click");
      }

      // File Downloads
      if (href && /\.(pdf|doc|docx|xls|xlsx|zip)(\?|$)/i.test(href)) {
        trackDigitalPresence("download", label || "Download", href);
        trackClarityEvent("brochure_download");
        return;
      }

      // External Links
      if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
        try {
          const linkUrl = new URL(href, window.location.href);
          if (linkUrl.origin !== window.location.origin) {
            trackDigitalPresence("external_link_click", label || "External Link", href);
            trackClarityEvent("external_link_click");
            return;
          }
        } catch {
          // Ignore URL parsing errors
        }
      }

      // CTA Detection
      const ctaWords = [
        "contact",
        "talk to",
        "request",
        "quote",
        "enquiry",
        "inquiry",
        "get started",
        "explore products",
        "learn more",
        "consult",
        "engineer",
        "download catalogue",
        "download catalog",
      ];
      const isCTA =
        interactive.classList.contains("bg-signal") ||
        interactive.classList.contains("btn-cta") ||
        ctaWords.some((word) => text.includes(word));

      if (isCTA) {
        trackDigitalPresence("cta_click", label || "CTA", href || "CTA button");
        trackClarityEvent("cta_click");
        if (text.includes("quote")) {
          trackClarityEvent("request_quote");
        }
        return;
      }

      // Internal Navigation
      if (interactive.tagName === "A" && href) {
        trackDigitalPresence("navigation_click", label || "Navigation", href);
        trackClarityEvent("navigation_click");
        return;
      }

      // General Button
      if (interactive.tagName === "BUTTON" || interactive.getAttribute("role") === "button" || interactive.tagName === "INPUT") {
        trackDigitalPresence("button_click", label || "Button", "Button interaction");
        trackClarityEvent("button_click");
      }
    };

    document.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  // 3. FORM SUBMISSION TRACKING
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;

      const formName =
        form.getAttribute("name") || form.id || form.getAttribute("aria-label") || "Website Form";

      trackDigitalPresence("form_submission", formName, "Form submitted");
      trackClarityEvent("form_submit");
      const lowerForm = formName.toLowerCase();
      if (lowerForm.includes("quote")) {
        trackClarityEvent("request_quote");
      }
      if (lowerForm.includes("enquiry") || lowerForm.includes("spec")) {
        trackClarityEvent("enquiry_submit");
      }
    };

    document.addEventListener("submit", handleSubmit);
    return () => {
      document.removeEventListener("submit", handleSubmit);
    };
  }, []);

  // 4. SCROLL DEPTH TRACKING
  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackedDepths = new Set<number>();

    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - viewportHeight;

      if (maxScroll <= 0) return;

      const percentage = Math.round((scrollTop / maxScroll) * 100);
      const depths = [25, 50, 75, 100];

      depths.forEach((depth) => {
        if (percentage >= depth && !trackedDepths.has(depth)) {
          trackedDepths.add(depth);
          trackDigitalPresence(`scroll_${depth}`, "page", `${depth}% scroll depth`);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  /* ---------------------------------------------
     WEBSITE UI
  --------------------------------------------- */

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <div className="flex min-h-screen flex-col">
          <Header />

          <Breadcrumbs />

          <main className="flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>

          <PageQuickBar />

          <Footer />

          <WhatsAppButton />

          <PrecisionAssistant />

          <GlobalModals />
        </div>
      </ModalProvider>
    </QueryClientProvider>
  );
}
