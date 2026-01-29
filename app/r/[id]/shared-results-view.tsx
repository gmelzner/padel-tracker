"use client";

import type { DecodedMatchResults } from "@/lib/share-codec";
import { SharedResultsDisplay } from "@/components/results/shared-results-display";

interface SharedResultsViewProps {
  data: DecodedMatchResults;
}

export function SharedResultsView({ data }: SharedResultsViewProps) {
  return <SharedResultsDisplay data={data} />;
}
