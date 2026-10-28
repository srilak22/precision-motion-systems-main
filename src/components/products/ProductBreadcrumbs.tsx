import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

interface ProductBreadcrumbsProps {
  categorySlug: string;
  categoryTitle: string;
  familyGroup: string;
  productName: string;
}

export function ProductBreadcrumbs({
  categorySlug,
  categoryTitle,
  familyGroup,
  productName,
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-[#667085] font-medium"
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#155EEF] transition-colors"
      >
        <Home size={13} className="text-[#98A2B3]" />
        <span>Home</span>
      </Link>

      <ChevronRight size={13} className="text-[#D0D5DD] shrink-0" />

      <Link
        to="/products"
        className="hover:text-[#155EEF] transition-colors uppercase font-semibold text-[11px] tracking-wider"
      >
        Products
      </Link>

      <ChevronRight size={13} className="text-[#D0D5DD] shrink-0" />

      <Link
        to="/products/$category"
        params={{ category: categorySlug }}
        className="hover:text-[#155EEF] transition-colors uppercase font-semibold text-[11px] tracking-wider"
      >
        {categoryTitle}
      </Link>

      {familyGroup && familyGroup !== categoryTitle && (
        <>
          <ChevronRight size={13} className="text-[#D0D5DD] shrink-0" />
          <span className="text-[#475467] font-semibold text-[11px] uppercase tracking-wider hidden sm:inline">
            {familyGroup}
          </span>
        </>
      )}

      <ChevronRight size={13} className="text-[#D0D5DD] shrink-0" />

      <span
        aria-current="page"
        className="text-[#155EEF] font-bold text-[11px] uppercase tracking-wider truncate max-w-[240px] sm:max-w-none"
      >
        {productName}
      </span>
    </nav>
  );
}
