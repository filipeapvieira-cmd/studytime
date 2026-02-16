"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RETENTION_ENDPOINT } from "@/src/constants/config";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import {
  useDataRetention,
  type DataRetentionPolicy,
} from "@/src/hooks/useDataRetention";

const POLICY_OPTIONS: { value: DataRetentionPolicy; label: string }[] = [
  { value: "MONTHS_6", label: "6 months" },
  { value: "MONTHS_12", label: "12 months" },
  { value: "MONTHS_24", label: "24 months" },
  { value: "UNTIL_DELETED", label: "Keep until I delete" },
];

/** Numeric rank so we can detect when a user picks a shorter window. */
const POLICY_RANK: Record<DataRetentionPolicy, number> = {
  MONTHS_6: 6,
  MONTHS_12: 12,
  MONTHS_24: 24,
  UNTIL_DELETED: Infinity,
};

export function DataRetention() {
  const { policy, isLoading, refetch } = useDataRetention();
  const { showToast } = useCustomToast();
  const [isSaving, setIsSaving] = useState(false);
  const [pendingPolicy, setPendingPolicy] =
    useState<DataRetentionPolicy | null>(null);

  const savePolicy = async (newPolicy: DataRetentionPolicy) => {
    setIsSaving(true);
    try {
      const res = await fetch(RETENTION_ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy: newPolicy }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update retention policy.");
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

  const handleChange = (value: string) => {
    const newPolicy = value as DataRetentionPolicy;
    // If shortening retention, ask for confirmation first
    if (POLICY_RANK[newPolicy] < POLICY_RANK[policy]) {
      setPendingPolicy(newPolicy);
    } else {
      savePolicy(newPolicy);
    }
  };

  const confirmShorter = () => {
    if (pendingPolicy) {
      savePolicy(pendingPolicy);
      setPendingPolicy(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Data retention</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Data retention</CardTitle>
          <CardDescription className="text-zinc-400">
            Choose how long Study Time keeps your sessions and optional
            journaling content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full sm:w-[240px]">
            <Select
              value={policy}
              onValueChange={handleChange}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                {POLICY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-zinc-500">
            Deleted items may remain in backups for a limited period.
          </p>
        </CardContent>
      </Card>

      <AlertDialog
        open={pendingPolicy !== null}
        onOpenChange={(open) => {
          if (!open) setPendingPolicy(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Shorten retention period?</AlertDialogTitle>
            <AlertDialogDescription>
              Switching to a shorter retention period will cause older sessions
              and journaling content to be automatically deleted during the next
              scheduled cleanup. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmShorter}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
