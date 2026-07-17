/**
 * Real, deterministic document comparison — an LCS-based line diff, not an
 * AI call. Operates on plain text, which is why it's scoped to
 * `GeneratedDocument` content (real text this app actually has) rather than
 * arbitrary uploaded files (binary, would need OCR text extraction first —
 * see `lib/platform/ai/document-analysis`'s mock `VersionComparisonService`
 * for that case). See docs/DOCUMENT_GENERATION.md.
 */

export type DiffOpType = "unchanged" | "added" | "removed" | "modified" | "moved";

export type DiffOp = {
  type: DiffOpType;
  oldLine?: string;
  newLine?: string;
  oldIndex?: number;
  newIndex?: number;
};

export type ComparisonReport = {
  ops: DiffOp[];
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  movedCount: number;
  unchangedCount: number;
  changePercentage: number;
  summary: string;
};

function longestCommonSubsequenceTable(a: string[], b: string[]): number[][] {
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  return table;
}

/** Raw add/remove/unchanged diff via LCS backtracking — the base every other classification (modified/moved) refines. */
function diffLinesRaw(oldLines: string[], newLines: string[]): DiffOp[] {
  const table = longestCommonSubsequenceTable(oldLines, newLines);
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < oldLines.length && j < newLines.length) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ type: "unchanged", oldLine: oldLines[i], newLine: newLines[j], oldIndex: i, newIndex: j });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      ops.push({ type: "removed", oldLine: oldLines[i], oldIndex: i });
      i++;
    } else {
      ops.push({ type: "added", newLine: newLines[j], newIndex: j });
      j++;
    }
  }
  while (i < oldLines.length) {
    ops.push({ type: "removed", oldLine: oldLines[i], oldIndex: i });
    i++;
  }
  while (j < newLines.length) {
    ops.push({ type: "added", newLine: newLines[j], newIndex: j });
    j++;
  }
  return ops;
}

function wordOverlapRatio(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 && wordsB.size === 0) return 1;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  return shared / Math.max(wordsA.size, wordsB.size, 1);
}

/**
 * Refines the raw diff: an adjacent removed→added pair with high word
 * overlap becomes "modified" (same clause, edited) rather than two separate
 * ops. A removed line whose exact text reappears as a *non-adjacent* added
 * line is "moved" rather than a separate removal + addition.
 */
export function compareDocumentVersions(oldText: string, newText: string): ComparisonReport {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const raw = diffLinesRaw(oldLines, newLines);

  // Pass 1: adjacent removed→added pairs with enough overlap become "modified".
  const merged: DiffOp[] = [];
  for (let k = 0; k < raw.length; k++) {
    const current = raw[k];
    const next = raw[k + 1];
    if (current.type === "removed" && next?.type === "added" && wordOverlapRatio(current.oldLine ?? "", next.newLine ?? "") >= 0.4) {
      merged.push({ type: "modified", oldLine: current.oldLine, newLine: next.newLine, oldIndex: current.oldIndex, newIndex: next.newIndex });
      k++; // consume the paired "added" op too
    } else {
      merged.push(current);
    }
  }

  // Pass 2: an exact-text removed/added pair that's NOT adjacent (so pass 1 didn't already merge it) is a move.
  const removedByText = new Map<string, DiffOp[]>();
  for (const op of merged) {
    if (op.type === "removed" && op.oldLine !== undefined) {
      const bucket = removedByText.get(op.oldLine) ?? [];
      bucket.push(op);
      removedByText.set(op.oldLine, bucket);
    }
  }
  const consumedRemoved = new Set<DiffOp>();
  const final: DiffOp[] = [];
  for (const op of merged) {
    if (op.type === "added" && op.newLine !== undefined) {
      const candidates = removedByText.get(op.newLine)?.filter((c) => !consumedRemoved.has(c));
      const match = candidates?.[0];
      if (match && op.newLine.trim().length > 0) {
        consumedRemoved.add(match);
        final.push({ type: "moved", oldLine: match.oldLine, newLine: op.newLine, oldIndex: match.oldIndex, newIndex: op.newIndex });
        continue;
      }
    }
    if (op.type === "removed" && consumedRemoved.has(op)) continue;
    final.push(op);
  }

  const counts = { added: 0, removed: 0, modified: 0, moved: 0, unchanged: 0 };
  for (const op of final) {
    if (op.type === "added") counts.added++;
    else if (op.type === "removed") counts.removed++;
    else if (op.type === "modified") counts.modified++;
    else if (op.type === "moved") counts.moved++;
    else counts.unchanged++;
  }

  const changedLines = counts.added + counts.removed + counts.modified + counts.moved;
  const totalLines = final.length || 1;
  const changePercentage = Math.round((changedLines / totalLines) * 100);

  return {
    ops: final,
    addedCount: counts.added,
    removedCount: counts.removed,
    modifiedCount: counts.modified,
    movedCount: counts.moved,
    unchangedCount: counts.unchanged,
    changePercentage,
    summary: `${changePercentage}% of lines changed — ${counts.added} added, ${counts.removed} removed, ${counts.modified} modified, ${counts.moved} moved.`,
  };
}
