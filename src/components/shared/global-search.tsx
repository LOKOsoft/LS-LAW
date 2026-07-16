"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Briefcase, FileText, LayoutDashboard } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { navSections } from "@/lib/constants/nav";
import { globalSearch, type GlobalSearchResult } from "@/features/search/actions";

const emptyResults: GlobalSearchResult = { clients: [], matters: [], documents: [] };

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<GlobalSearchResult>(emptyResults);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (query.trim().length < 2) {
      const reset = setTimeout(() => setResults(emptyResults), 0);
      return () => clearTimeout(reset);
    }
    const timeout = setTimeout(() => {
      setIsLoading(true);
      globalSearch(query)
        .then(setResults)
        .finally(() => setIsLoading(false));
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const runCommand = React.useCallback((action: () => void) => {
    setOpen(false);
    setQuery("");
    action();
  }, []);

  const hasResults = results.clients.length + results.matters.length + results.documents.length > 0;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full max-w-sm justify-start gap-2 rounded-lg text-muted-foreground sm:w-64"
      >
        <Search className="size-4" />
        <span className="text-sm">Search LEXORA...</span>
        <CommandShortcut className="ml-auto hidden sm:inline">⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Global search" description="Search clients, matters, and documents">
        <CommandInput placeholder="Search clients, matters, documents..." value={query} onValueChange={setQuery} />
        <CommandList>
          {query.trim().length < 2 ? (
            <CommandGroup heading="Navigate">
              {navSections.flatMap((s) => s.items).map((item) => (
                <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))}>
                  <LayoutDashboard className="size-4 text-muted-foreground" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <>
              <CommandEmpty>{isLoading ? "Searching..." : "No results found."}</CommandEmpty>
              {results.clients.length > 0 ? (
                <CommandGroup heading="Clients">
                  {results.clients.map((c) => (
                    <CommandItem key={c.id} onSelect={() => runCommand(() => router.push(`/managing-partner/clients/${c.id}`))}>
                      <Users className="size-4 text-muted-foreground" />
                      {c.name}
                      <CommandShortcut>{c.clientNumber}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {results.matters.length > 0 ? (
                <CommandGroup heading="Matters">
                  {results.matters.map((m) => (
                    <CommandItem key={m.id} onSelect={() => runCommand(() => router.push(`/managing-partner/matters/${m.id}`))}>
                      <Briefcase className="size-4 text-muted-foreground" />
                      {m.title}
                      <CommandShortcut>{m.matterNumber}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {results.documents.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Documents">
                    {results.documents.map((d) => (
                      <CommandItem
                        key={d.id}
                        onSelect={() =>
                          runCommand(() =>
                            router.push(d.matterId ? `/managing-partner/matters/${d.matterId}` : "/managing-partner/documents"),
                          )
                        }
                      >
                        <FileText className="size-4 text-muted-foreground" />
                        {d.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {!hasResults && !isLoading ? null : null}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
