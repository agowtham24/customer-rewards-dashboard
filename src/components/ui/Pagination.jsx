import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

/**
 * Root pagination navigation container.
 *
 * @param {React.ComponentProps<"nav">} props
 * @returns {JSX.Element}
 */
const Pagination = React.memo(function Pagination({
  className,
  ...props
}) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex justify-center", className)}
      {...props}
    />
  );
});

/**
 * Container for pagination items.
 *
 * @param {React.ComponentProps<"ul">} props
 * @returns {JSX.Element}
 */
const PaginationContent = React.memo(function PaginationContent({
  className,
  ...props
}) {
  return (
    <ul
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
});

/**
 * Wrapper for a pagination item.
 *
 * @param {React.ComponentProps<"li">} props
 * @returns {JSX.Element}
 */
const PaginationItem = React.memo(function PaginationItem(props) {
  return <li {...props} />;
});

/**
 * Pagination link button.
 *
 * @param {Object} props
 * @param {boolean} props.isActive
 * @param {string} props.size
 * @returns {JSX.Element}
 */
const PaginationLink = React.memo(function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}) {
  return (
    <Button
      asChild
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={className}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        {...props}
      />
    </Button>
  );
});

/**
 * Previous page button.
 *
 * @param {Object} props
 * @param {string} props.text
 * @returns {JSX.Element}
 */
const PaginationPrevious = React.memo(function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={className}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
});

/**
 * Next page button.
 *
 * @param {Object} props
 * @param {string} props.text
 * @returns {JSX.Element}
 */
const PaginationNext = React.memo(function PaginationNext({
  className,
  text = "Next",
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={className}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
});

/**
 * Ellipsis indicator used for collapsed page ranges.
 *
 * @param {React.ComponentProps<"span">} props
 * @returns {JSX.Element}
 */
const PaginationEllipsis = React.memo(function PaginationEllipsis({
  className,
  ...props
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-8 w-8 items-center justify-center",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
});

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};