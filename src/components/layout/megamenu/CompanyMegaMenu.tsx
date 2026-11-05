import React from "react";
import { AboutMegaMenu, AboutMegaMenuProps } from "@/components/navigation/AboutMegaMenu";

export { AboutMegaMenu };
export type { AboutMegaMenuProps };

/**
 * CompanyMegaMenu re-exports the enhanced AboutMegaMenu
 * ensuring full backward-compatibility with existing header navigation hooks.
 */
export function CompanyMegaMenu(props: AboutMegaMenuProps) {
  return <AboutMegaMenu {...props} />;
}
