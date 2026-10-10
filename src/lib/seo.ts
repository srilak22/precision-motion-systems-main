/**
 * Production SEO and Canonical URL Utilities
 * Generates verified, standardized metadata, OpenGraph, Twitter, and canonical links.
 */

export const SITE_ORIGIN = "https://precision-motion-systems-main.vercel.app";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/robotics-hero.jpg`;

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article" | undefined;
  image?: string | undefined;
  noindex?: boolean | undefined;
}

export function buildSeoMeta(config: SeoConfig) {
  const fullUrl = `${SITE_ORIGIN}${config.path.startsWith("/") ? config.path : `/${config.path}`}`;
  const imageUrl = config.image?.startsWith("http")
    ? config.image
    : config.image
      ? `${SITE_ORIGIN}${config.image.startsWith("/") ? config.image : `/${config.image}`}`
      : DEFAULT_OG_IMAGE;

  const meta: Array<Record<string, string>> = [
    { title: config.title },
    { name: "description", content: config.description },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:type", content: config.ogType || "website" },
    { property: "og:url", content: fullUrl },
    { property: "og:image", content: imageUrl },
    { property: "og:site_name", content: "INDUS Industrial Robotics" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: imageUrl },
  ];

  if (config.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  const links: Array<Record<string, string>> = [];
  if (!config.noindex) {
    links.push({ rel: "canonical", href: fullUrl });
  }

  return { meta, links };
}
