"use client";

import { useEffect, useState, useCallback } from "react";
import { Session, Identity } from "@ory/client";
import { kratosClient } from "@/lib/kratos/client";

interface UseSessionResult {
  session: Session | null;
  identity: Identity | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await kratosClient.toSession();
      setSession(data);
      setError(null);
    } catch (err) {
      setSession(null);
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    identity: session?.identity ?? null,
    isLoading,
    error,
    isAuthenticated: !!session,
    refetch: fetchSession,
  };
}
