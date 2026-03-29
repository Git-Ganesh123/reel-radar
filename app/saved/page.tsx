"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSavedItems } from "@/hooks/use-saved";
import { SavedGrid } from "@/components/ui/saved-grid";
import { Loader2, Bookmark } from "lucide-react";

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: items, isLoading } = useSavedItems();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="h-5 w-5 text-brand-500" />
          <h1 className="text-2xl font-semibold text-ink-900">Saved Trends</h1>
        </div>
        <p className="text-sm text-ink-500">
          Your bookmarked trends for quick reference and replication.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
        </div>
      ) : (
        <SavedGrid items={items ?? []} />
      )}
    </div>
  );
}
