"use client";

import type { DecodedMatchResults } from "@/lib/share-codec";
import { SharedResultsDisplay } from "@/components/results/shared-results-display";

interface SharedResultsViewProps {
  data: DecodedMatchResults;
  sharedId: string;
}

export function SharedResultsView({ data, sharedId }: SharedResultsViewProps) {
  return <SharedResultsDisplay data={data} sourceSharedId={sharedId} />;
}
