import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "lucide-react";

const Select = React.memo(function Select(props) {
  return <SelectPrimitive.Root {...props} />;
});

const SelectGroup = React.memo(function SelectGroup({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Group
      className={cn("p-1", className)}
      {...props}
    />
  );
});

const SelectValue = React.memo(function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
});

const SelectTrigger = React.memo(function SelectTrigger({
  className,
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-9 items-center justify-between rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

const SelectContent = React.memo(function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "z-50 min-w-36 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

const SelectLabel = React.memo(function SelectLabel({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-2 py-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

const SelectItem = React.memo(function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center rounded-md py-2 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const SelectSeparator = React.memo(function SelectSeparator({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Separator
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
});

const SelectScrollUpButton = React.memo(function SelectScrollUpButton(
  props,
) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});

const SelectScrollDownButton = React.memo(function SelectScrollDownButton(
  props,
) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};