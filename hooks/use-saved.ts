"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { SavedItem, Trend } from "@/types";

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function fetchSaved(): Promise<SavedItem[]> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/saved", { headers });
  if (!res.ok) throw new Error("Failed to fetch saved items");
  return res.json();
}

async function saveTrend(trend: Trend): Promise<SavedItem> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/save-trend", {
    method: "POST",
    headers,
    body: JSON.stringify({ trend_data: trend }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to save trend");
  }
  return res.json();
}

async function removeSaved(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch("/api/remove-saved", {
    method: "POST",
    headers,
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to remove saved item");
}

export function useSavedItems() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved", user?.id],
    queryFn: fetchSaved,
    enabled: !!user,
    staleTime: 1000 * 60,
  });
}

export function useSaveTrend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveTrend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}

export function useRemoveSaved() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeSaved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });
}
