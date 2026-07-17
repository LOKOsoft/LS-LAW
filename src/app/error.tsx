"use client";

import * as React from "react";
import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/platform/logging/logger";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    logger.error("route_error_boundary", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <ErrorState
        title="Something went wrong"
        description={
          error.digest
            ? `An unexpected error occurred. Reference: ${error.digest}`
            : "An unexpected error occurred. Please try again."
        }
        className="max-w-md border-none bg-transparent"
        action={
          <div className="flex justify-center gap-2">
            <Button onClick={() => reset()}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to dashboard</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
