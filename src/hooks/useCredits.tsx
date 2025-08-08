import { useEffect, useState, useCallback } from "react";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from "../integrations/supabase/types";

export function useCredits(userId?: string) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient<Database>();

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
      .single();

    console.log('Credits fetch result:', { data, error, userId });

    if (error) {
      console.error('Credits fetch error:', error);
      setError(error.message);
    } else {
      console.log('Credits data:', data);
      setError(null);
      setCredits((data as { credits: number } | null)?.credits ?? null);
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