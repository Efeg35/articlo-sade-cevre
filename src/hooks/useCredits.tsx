import { useEffect, useState, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";
import { Tables } from "../integrations/supabase/types";

export function useCredits(userId?: string) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single<{
        credits: Tables<"profiles">["credits"]
      }>();
    if (error) setError(error.message);
    else setCredits(data?.credits ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // İlk yükleme
    fetchCredits();

    // Real-time subscription
    const channel = supabase
      .channel(`credits-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('Credits updated:', payload);
          if (payload.new && typeof payload.new.credits === 'number') {
            setCredits(payload.new.credits);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchCredits]);

  return { credits, loading, error, refetch: fetchCredits, setCredits };
} 