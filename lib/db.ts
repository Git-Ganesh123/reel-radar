import { supabase } from "./supabase";
import type { Trend, SavedItem } from "@/types";

export async function saveTrend(
  userId: string,
  trendData: Trend
): Promise<SavedItem> {
  const { data, error } = await supabase
    .from("saved_items")
    .insert({
      user_id: userId,
      item_type: "trend",
      trend_data: trendData,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SavedItem;
}

export async function getSavedItems(userId: string): Promise<SavedItem[]> {
  const { data, error } = await supabase
    .from("saved_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SavedItem[];
}

export async function removeSavedItem(
  userId: string,
  itemId: string
): Promise<void> {
  const { error } = await supabase
    .from("saved_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function isTrendSaved(
  userId: string,
  trendId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("saved_items")
    .select("id")
    .eq("user_id", userId)
    .filter("trend_data->>trend_id", "eq", trendId);

  if (error) return false;
  return (data?.length ?? 0) > 0;
}

export async function logSearch(
  niche: string,
  userId?: string
): Promise<void> {
  await supabase.from("searches").insert({
    niche,
    user_id: userId ?? null,
  });
}
