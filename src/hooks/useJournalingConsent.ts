"use client";

import { useCallback, useEffect, useState } from "react";
import { CONSENT_ENDPOINT } from "@/src/constants/config";

export function useJournalingConsent() {
  const [consentEnabled, setConsentEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConsent = useCallback(async () => {
    try {
      const res = await fetch(CONSENT_ENDPOINT);
      const json = await res.json();
      setConsentEnabled(json.data?.journalingConsentEnabled ?? false);
    } catch {
      setConsentEnabled(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsent();
  }, [fetchConsent]);

  return { consentEnabled, isLoading, refetch: fetchConsent };
}
