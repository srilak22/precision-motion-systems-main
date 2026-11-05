import { useNavigate, useRouterState } from "@tanstack/react-router";
import { trackDigitalPresence } from "@/trackDigitalPresence";
import { trackClarityEvent } from "@/analytics/clarity";

/**
 * Custom hook to execute verified navigation across the About Us mega-menu,
 * secondary anchor navigation bar, and cross-page anchor transitions.
 */
export function useAboutNavigation(onClose?: () => void) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navigateTo = (href: string, title?: string) => {
    if (title) {
      trackDigitalPresence("navigation", `About Nav - ${title}`, href);
      trackClarityEvent("about_nav_click");
    }

    if (onClose) {
      onClose();
    }

    const isAnchor = href.includes("#");
    const isAboutTarget = href.startsWith("/about#") || (isAnchor && href.startsWith("#"));

    if (isAboutTarget && currentPath === "/about") {
      const hash = href.includes("#") ? href.split("#")[1] : href.replace("#", "");
      const target = document.getElementById(hash);

      if (target) {
        const navOffset = 135;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        window.history.pushState(null, "", `/about#${hash}`);
        return;
      }
    }

    // Cross-page anchor navigation or standard route navigation
    if (isAnchor) {
      const [path, hash] = href.split("#");
      navigate({ to: (path || "/about") as never, hash });
    } else {
      navigate({ to: href as never });
    }
  };

  return { navigateTo };
}
