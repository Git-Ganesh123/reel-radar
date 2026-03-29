"use client";

import { useQuery } from "@tanstack/react-query";
import type { TrendsResponse } from "@/types";

async function fetchTrends(niche: string): Promise<TrendsResponse> {
  const res = await fetch("/api/trends", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ niche }),
  });
  if (!res.ok) throw new Error("Failed to fetch trends");
  return res.json();
}

export function useTrends(niche: string | null) {
  return useQuery({
    queryKey: ["trends", niche],
    queryFn: () => fetchTrends(niche!),
    enabled: !!niche,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
