"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Briefcase, FileText, LayoutDashboard, Gavel, Receipt, CheckSquare, StickyNote, UserCog, Building2 } from "lucide-react";
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
import { ALL_MODULE_KEYS, buildNavSections, type ModuleKey } from "@/lib/constants/nav";
import { globalSearch, type GlobalSearchResult } from "@/features/search/actions";

const emptyResults: GlobalSearchResult = {
  clients: [],
  matters: [],
  documents: [],
  hearings: [],
  invoices: [],
  tasks: [],
  notes: [],
  employees: [],
  companies: [],
};

export function GlobalSearch({
  basePath = "/managing-partner",
  allowedKeys = ALL_MODULE_KEYS,
}: {
  basePath?: string;
  allowedKeys?: ModuleKey[];
}) {
  const router = useRouter();
  const navSections = buildNavSections(basePath, allowedKeys);
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

  function runCommand(action: () => void) {
    setOpen(false);
    setQuery("");
    action();
  }

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
                    <CommandItem key={c.id} onSelect={() => runCommand(() => router.push(`${basePath}/clients/${c.id}`))}>
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
                    <CommandItem key={m.id} onSelect={() => runCommand(() => router.push(`${basePath}/matters/${m.id}`))}>
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
                            router.push(d.matterId ? `${basePath}/matters/${d.matterId}` : `${basePath}/documents`),
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
              {results.hearings.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Hearings">
                    {results.hearings.map((h) => (
                      <CommandItem key={h.id} onSelect={() => runCommand(() => router.push(`${basePath}/matters/${h.matterId}`))}>
                        <Gavel className="size-4 text-muted-foreground" />
                        {h.hearingType} — {h.courtName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {results.invoices.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Invoices">
                    {results.invoices.map((i) => (
                      <CommandItem
                        key={i.id}
                        onSelect={() =>
                          runCommand(() => router.push(i.matterId ? `${basePath}/matters/${i.matterId}` : `${basePath}/billing`))
                        }
                      >
                        <Receipt className="size-4 text-muted-foreground" />
                        {i.invoiceNumber}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {results.tasks.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Tasks">
                    {results.tasks.map((t) => (
                      <CommandItem
                        key={t.id}
                        onSelect={() =>
                          runCommand(() => router.push(t.matterId ? `${basePath}/matters/${t.matterId}` : `${basePath}/tasks`))
                        }
                      >
                        <CheckSquare className="size-4 text-muted-foreground" />
                        {t.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {results.notes.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Notes">
                    {results.notes.map((n) => (
                      <CommandItem
                        key={n.id}
                        onSelect={() =>
                          runCommand(() =>
                            router.push(
                              n.matterId
                                ? `${basePath}/matters/${n.matterId}`
                                : n.clientId
                                  ? `${basePath}/clients/${n.clientId}`
                                  : `${basePath}/notes`,
                            ),
                          )
                        }
                      >
                        <StickyNote className="size-4 text-muted-foreground" />
                        {n.body.slice(0, 60)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {results.employees.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Employees">
                    {results.employees.map((e) => (
                      <CommandItem key={e.id} onSelect={() => runCommand(() => router.push(`${basePath}/hr`))}>
                        <UserCog className="size-4 text-muted-foreground" />
                        {e.name}
                        <CommandShortcut>{e.role.replace(/_/g, " ")}</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
              {results.companies.length > 0 ? (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Companies">
                    {results.companies.map((c) => (
                      <CommandItem key={c.id} onSelect={() => runCommand(() => router.push(`${basePath}/companies`))}>
                        <Building2 className="size-4 text-muted-foreground" />
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
