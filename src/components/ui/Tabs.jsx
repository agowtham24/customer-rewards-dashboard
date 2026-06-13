import * as React from "react";
import { cva } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tabs root component.
 */
const Tabs = React.memo(function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <TabsPrimitive.Root
      className={cn(
        orientation === "vertical"
          ? "flex gap-4"
          : "flex flex-col gap-4",
        className,
      )}
      {...props}
    />
  );
});

const tabsListVariants = cva(
  "inline-flex items-center rounded-lg bg-muted p-1",
  {
    variants: {
      variant: {
        default: "",
        line: "bg-transparent gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Tabs list container.
 */
const TabsList = React.memo(function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        tabsListVariants({ variant }),
        className,
      )}
      {...props}
    />
  );
});

/**
 * Individual tab trigger.
 *
 * Simplified from the generated shadcn styles to improve readability
 * and make theme debugging easier.
 */
const TabsTrigger = React.memo(function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        "text-muted-foreground hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background",
        "data-[state=active]:text-primary",
        "data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Tab content container.
 */
const TabsContent = React.memo(function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "flex-1 text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
});

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
};