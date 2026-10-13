import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { MENU_FILTERS, type MenuFilterId } from "@/lib/menu";

interface CategoryFilterProps {
  active: MenuFilterId;
  onChange: (id: MenuFilterId) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Id of the element the result count is describing, for assistive technology. */
  resultsId: string;
  resultCount: number;
}

/**
 * Category filters and optional search (PRD §6.6).
 *
 * Selected state is exposed with `aria-pressed`, so a screen reader announces
 * "All, pressed" rather than relying on colour alone. The strip scrolls
 * horizontally on narrow screens inside its own container — the page itself
 * never scrolls sideways.
 */
export function CategoryFilter({
  active,
  onChange,
  query,
  onQueryChange,
  resultsId,
  resultCount,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Filter the menu by category"
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0"
        >
          {MENU_FILTERS.map((filter) => {
            const isActive = filter.id === active;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onChange(filter.id)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium whitespace-nowrap",
                  "transition-colors duration-200 ease-[var(--ease-sol)]",
                  isActive
                    ? "border-espresso bg-espresso text-ivory"
                    : "border-espresso/20 text-espresso/75 hover:border-espresso/45 hover:text-espresso",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative md:w-64">
          <label htmlFor="menu-search" className="sr-only">
            Search the menu
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-espresso/70"
          />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search the menu"
            autoComplete="off"
            className={cn(
              // 16px keeps mobile browsers from zooming the layout on focus.
              "h-11 w-full rounded-full border border-espresso/20 bg-cream/70 pr-11 pl-11 text-base text-espresso",
              "placeholder:text-espresso/65 focus-visible:border-espresso/45 focus-visible:outline-none",
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute top-1/2 right-1 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-espresso/70 hover:text-espresso"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      </div>

      <p id={resultsId} aria-live="polite" className="text-caption text-espresso/70">
        {resultCount === 1 ? "1 item" : `${resultCount} items`}
      </p>
    </div>
  );
}
