"use client";

import { useCallback, useEffect, useState } from "react";
import { RETENTION_ENDPOINT } from "@/src/constants/config";

export type DataRetentionPolicy =
  | "MONTHS_6"
  | "MONTHS_12"
  | "MONTHS_24"
  | "UNTIL_DELETED";

export function useDataRetention() {
  const [policy, setPolicy] = useState<DataRetentionPolicy>("UNTIL_DELETED");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPolicy = useCallback(async () => {
    try {
      const res = await fetch(RETENTION_ENDPOINT);
      const json = await res.json();
      setPolicy(json.data?.policy ?? "UNTIL_DELETED");
    } catch {
      setPolicy("UNTIL_DELETED");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  return { policy, isLoading, refetch: fetchPolicy };
}
