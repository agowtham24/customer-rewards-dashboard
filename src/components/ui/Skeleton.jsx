import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Skeleton placeholder component used while content is loading.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const Skeleton = React.memo(function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  );
});

export { Skeleton };