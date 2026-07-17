import { Skeleton } from "@/components/ui/skeleton";

/**
 * Root-level loading fallback — shown by Next.js while a route segment's
 * Server Component data fetch is in flight. Kept deliberately lightweight
 * (a few skeleton bars, not a full page layout mimic) since most navigations
 * in this app resolve quickly and a heavier fallback would just flash.
 */
export default function Loading() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}
