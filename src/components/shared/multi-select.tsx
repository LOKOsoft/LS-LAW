"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type MultiSelectOption = { label: string; value: string };

type MultiSelectProps = {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  function remove(value: string, event: React.MouseEvent) {
    event.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  }

  const selectedOptions = options.filter((o) => selected.includes(o.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("h-auto min-h-9 w-full justify-between font-normal", className)}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge key={option.value} variant="secondary" className="gap-1">
                  {option.label}
                  <button
                    type="button"
                    onClick={(event) => remove(option.value, event)}
                    className="rounded-full outline-none hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem key={option.value} onSelect={() => toggle(option.value)}>
                    <Check className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
