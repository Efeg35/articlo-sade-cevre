import { useEffect, useState, useCallback } from "react";
import { supabase } from "../integrations/supabase/client";
import { Tables } from "../integrations/supabase/types";

export function useCredits(userId?: string) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!userId) {
      console.log('No userId provided for credits fetch');
      return;
    }
    setLoading(true);
    console.log('Fetching credits for user:', userId);

    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single<{
        credits: Tables<"profiles">["credits"]
      }>();

    console.log('Credits fetch result:', { data, error, userId });

    if (error) {
      console.error('Credits fetch error:', error);
      setError(error.message);
    } else {
      console.log('Credits data:', data);
      setCredits(data?.credits ?? null);
    }
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