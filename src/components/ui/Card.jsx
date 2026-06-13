import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card container component.
 */
const Card = React.memo(function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Card header.
 */
const CardHeader = React.memo(function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
});

/**
 * Card title.
 */
const CardTitle = React.memo(function CardTitle({ className, ...props }) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
});

/**
 * Card description.
 */
const CardDescription = React.memo(function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

/**
 * Card action area.
 */
const CardAction = React.memo(function CardAction({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-end", className)}
      {...props}
    />
  );
});

/**
 * Card body.
 */
const CardContent = React.memo(function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
});

/**
 * Card footer.
 */
const CardFooter = React.memo(function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center border-t px-6 py-4", className)}
      {...props}
    />
  );
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
