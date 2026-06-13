import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Responsive table container.
 */
const Table = React.memo(function Table({
  className,
  ...props
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
});

/**
 * Table header section.
 */
const TableHeader = React.memo(function TableHeader({
  className,
  ...props
}) {
  return (
    <thead
      className={cn("border-b", className)}
      {...props}
    />
  );
});

/**
 * Table body section.
 */
const TableBody = React.memo(function TableBody({
  className,
  ...props
}) {
  return (
    <tbody
      className={cn(className)}
      {...props}
    />
  );
});

/**
 * Table footer section.
 */
const TableFooter = React.memo(function TableFooter({
  className,
  ...props
}) {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Table row.
 */
const TableRow = React.memo(function TableRow({
  className,
  ...props
}) {
  return (
    <tr
      className={cn(
        "border-b hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Table header cell.
 */
const TableHead = React.memo(function TableHead({
  className,
  ...props
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left font-medium",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Table data cell.
 */
const TableCell = React.memo(function TableCell({
  className,
  ...props
}) {
  return (
    <td
      className={cn(
        "px-3 py-2",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Table caption.
 */
const TableCaption = React.memo(function TableCaption({
  className,
  ...props
}) {
  return (
    <caption
      className={cn(
        "mt-4 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};