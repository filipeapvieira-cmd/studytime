"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { CONSENT_ENDPOINT } from "@/src/constants/config";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import { useJournalingConsent } from "@/src/hooks/useJournalingConsent";
import { DataRetention } from "./data-retention";
import { DeleteAccount } from "./delete-account";
import { ExportData } from "./export-data";

const CONSENT_TEXT =
  "Optional feature. When enabled, you can record feelings and add free-text reflections. Optional journaling data is encrypted by the application before storage and is not readable in plaintext by database administrators. You can disable this at any time to stop saving new entries, and you can delete existing entries in your journal.";

export function PrivacySettings() {
  const { consentEnabled, isLoading, refetch } = useJournalingConsent();
  const { showToast } = useCustomToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (pressed: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch(CONSENT_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: pressed }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update consent.");
      }
      showToast({ status: "success", message: json.message });
      await refetch();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Something went wrong.";
      showToast({ status: "error", message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">Privacy</h2>
        <p className="text-zinc-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Privacy</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Manage your data and consent preferences.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="journaling-consent"
            className="text-base font-medium text-zinc-100"
          >
            Enable optional journaling (Feelings & Reflections)
          </Label>
          <Toggle
            id="journaling-consent"
            variant="outline"
            pressed={consentEnabled}
            onPressedChange={handleToggle}
            disabled={isSaving}
            aria-label="Toggle journaling consent"
            className="data-[state=on]:bg-emerald-600 data-[state=on]:text-white"
          >
            {consentEnabled ? "On" : "Off"}
          </Toggle>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">{CONSENT_TEXT}</p>
      </div>

      <DataRetention />

      <ExportData />

      <DeleteAccount />
    </div>
  );
}
