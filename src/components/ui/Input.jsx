import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Reusable input component.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const Input = React.memo(function Input({
  className,
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
