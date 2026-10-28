import React, { useState, useMemo } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory, productsIn, CATEGORY_SLUG_ALIASES } from "@/data/robotics";
import { TOP_LEVEL_CATEGORIES } from "@/data/productTaxonomy";
import { buildSeoMeta } from "@/lib/seo";
import { PrecisionReducersCatalogue } from "@/components/engineering/PrecisionReducersCatalogue";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryFamilyNav, type FamilyNavItem } from "@/components/category/CategoryFamilyNav";
import { CategoryFilterBar } from "@/components/category/CategoryFilterBar";
import { CategoryProductGrid } from "@/components/category/CategoryProductGrid";
import { CategorySelectionGuidance } from "@/components/category/CategorySelectionGuidance";
import { CategoryApplicationsSection } from "@/components/category/CategoryApplicationsSection";
import { CategoryEnquirySection } from "@/components/category/CategoryEnquirySection";

export const Route = createFileRoute("/products/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) {
      throw notFound();
    }
    return { category };
  },
  head: ({ loaderData }) => {
    const category = loaderData?.category;
    if (category?.slug === "precision-reducers") {
      return buildSeoMeta({
        title: "Precision Reducers & Gearboxes | Engineering Catalogue | INDUS Robotics",
        description:
          "Zero-backlash strain-wave gearheads, RV cycloidal drives, and precision planetary gearboxes. 24 verified ranges with ISO 9283 and DIN 3990 specifications.",
        path: "/products/precision-reducers",
      });
    }
    return buildSeoMeta({
      title: `${category?.title || "Robotics"} | INDUS Industrial Robotics`,
      description:
        category?.seoDescription ||
        category?.intro ||
        "Precision industrial robotics components and motion systems.",
      path: `/products/${category?.slug || ""}`,
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();

  // Keep specialized Precision Reducers interactive tool when requested directly
  if (category.slug === "precision-reducers") {
    return <PrecisionReducersCatalogue />;
  }

  // 1. Resolve all canonical products for this category
  const allProducts = useMemo(() => {
    return productsIn(category.slug);
  }, [category.slug]);

  // 2. Resolve Master Taxonomy Category metadata if available
  const topCat = useMemo(() => {
    const norm = category.slug.toLowerCase().trim();
    const alias = CATEGORY_SLUG_ALIASES[norm];
    return TOP_LEVEL_CATEGORIES.find((cat) => cat.id === norm || (alias && cat.id === alias));
  }, [category.slug]);

  // 3. Resolve actual Product Families for Section B navigation
  const families: FamilyNavItem[] = useMemo(() => {
    if (topCat && topCat.groups && topCat.groups.length > 0) {
      return topCat.groups.map((g) => ({
        id: g.groupName,
        name: g.groupName,
        description: g.technologyDescription,
        productCount: g.items.length,
      }));
    }

    if (category.subFamilies && category.subFamilies.length > 0) {
      return category.subFamilies.map((sub) => {
        const count = allProducts.filter(
          (p) => p.slug === sub.slug || p.id === sub.slug
        ).length;
        return {
          id: sub.slug,
          name: sub.name,
          description: sub.description,
          productCount: count > 0 ? count : 1,
        };
      });
    }

    return [];
  }, [topCat, category.subFamilies, allProducts]);

  // 4. Filter & Search State for Section C
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"default" | "name-asc" | "name-desc" | "model">("default");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedFamilyId("all");
    setSortOption("default");
  };

  // 5. Apply filtering and sorting across actual product data
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by Family
    if (selectedFamilyId !== "all") {
      if (topCat) {
        const targetGroup = topCat.groups.find((g) => g.groupName === selectedFamilyId);
        if (targetGroup) {
          const itemIds = new Set(targetGroup.items.map((i) => i.id));
          result = result.filter((p) => itemIds.has(p.id) || itemIds.has(p.slug));
        }
      } else {
        result = result.filter(
          (p) => p.slug === selectedFamilyId || p.id === selectedFamilyId
        );
      }
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const slugMatch = p.slug.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
        const descMatch =
          p.shortDescription?.toLowerCase().includes(q) ||
          p.positioning?.toLowerCase().includes(q) ||
          p.overview?.toLowerCase().includes(q);
        const specMatch = p.specifications?.some(
          (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );
        return nameMatch || slugMatch || descMatch || specMatch;
      });
    }

    // Sorting
    if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "model") {
      result.sort((a, b) => (a.slug || a.id).localeCompare(b.slug || b.id));
    }

    return result;
  }, [allProducts, selectedFamilyId, topCat, searchQuery, sortOption]);

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedFamilyId !== "all" ||
    sortOption !== "default";

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION A: Breadcrumb and Category Introduction */}
      <CategoryHero
        category={category}
        totalProductsCount={allProducts.length}
        familyCount={families.length}
        engineeringStandard={topCat?.engineeringStandard}
      />

      {/* SECTION B: Product Family Navigation */}
      {families.length > 0 && (
        <CategoryFamilyNav
          families={families}
          selectedFamilyId={selectedFamilyId}
          onSelectFamily={setSelectedFamilyId}
          totalProductsCount={allProducts.length}
        />
      )}

      {/* SECTION C: Search, Filters, and Sorting */}
      <CategoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        families={families}
        selectedFamilyId={selectedFamilyId}
        onFamilyChange={setSelectedFamilyId}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={handleResetFilters}
        filteredCount={filteredProducts.length}
        totalCount={allProducts.length}
      />

      {/* SECTION D: Product Grid */}
      <CategoryProductGrid
        products={filteredProducts}
        categoryTitle={category.title}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* SECTION E: Technical Selection Guidance */}
      <CategorySelectionGuidance category={category} />

      {/* SECTION F: Applications and Related Technologies */}
      <CategoryApplicationsSection category={category} />

      {/* SECTION G: Engineering Enquiry Strip */}
      <CategoryEnquirySection category={category} />
    </div>
  );
}
