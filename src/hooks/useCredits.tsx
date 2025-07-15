import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { Tables } from "../integrations/supabase/types";

export function useCredits(userId?: string) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
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
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { credits, loading, error, refetch: fetchCredits, setCredits };
} 