import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Scrollable container component.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ScrollArea = React.memo(function ScrollArea({
  className,
  children,
  ...props
}) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-inherit">
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});

/**
 * Scroll bar component.
 *
 * @param {Object} props
 * @param {"vertical"|"horizontal"} props.orientation
 * @returns {JSX.Element}
 */
const ScrollBar = React.memo(function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        orientation === "vertical"
          ? "flex w-2.5"
          : "flex h-2.5",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});

export { ScrollArea, ScrollBar };