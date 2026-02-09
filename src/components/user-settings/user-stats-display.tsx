"use client";

import { BookOpen, Cloud, Hash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";

type UserStats = {
  sessions: number;
  topics: number;
  cloudinaryConfigs: number;
};

export function UserStatsDisplay() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/user/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data: UserStats = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <p className="text-zinc-500 text-sm">
        Unable to load usage statistics at this time.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex flex-col items-center p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
        <BookOpen className="h-5 w-5 text-blue-400 mb-3" />
        <span className="text-2xl font-bold text-white">{stats.sessions}</span>
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
          Sessions
        </span>
      </div>

      <div className="flex flex-col items-center p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
        <Hash className="h-5 w-5 text-blue-400 mb-3" />
        <span className="text-2xl font-bold text-white">{stats.topics}</span>
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
          Topics
        </span>
      </div>

      <div className="flex flex-col items-center p-4 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors">
        <Cloud className="h-5 w-5 text-blue-400 mb-3" />
        <span className="text-2xl font-bold text-white">
          {stats.cloudinaryConfigs}
        </span>
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
          Uploads
        </span>
      </div>
    </div>
  );
}
