"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type UserStats = {
  sessions: number;
  topics: number;
  cloudinaryConfigs: number;
};

type DeleteResponse = {
  success: boolean;
  deletedAt: string;
};

export function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data: UserStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to load account data. Please try again.",
        variant: "destructive",
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchStats();
    } else {
      setStats(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      const data: DeleteResponse = await response.json();

      // Format the deletion time
      const deletionDate = new Date(data.deletedAt);
      const formattedDate = deletionDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTime = deletionDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Build the records summary using the stats we already have
      const recordSummary = stats
        ? [
            stats.sessions > 0
              ? `${stats.sessions} session${stats.sessions !== 1 ? "s" : ""}`
              : null,
            stats.topics > 0
              ? `${stats.topics} topic${stats.topics !== 1 ? "s" : ""}`
              : null,
            stats.cloudinaryConfigs > 0
              ? `${stats.cloudinaryConfigs} upload reference${stats.cloudinaryConfigs !== 1 ? "s" : ""}`
              : null,
          ]
            .filter(Boolean)
            .join(", ")
        : "";

      toast({
        title: "Account Deleted",
        description: `Your account was deleted on ${formattedDate} at ${formattedTime}. ${recordSummary ? `Removed: ${recordSummary}.` : ""}`,
        duration: 10000,
      });

      // Sign out the user after a short delay to let them see the toast
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Deletion Failed",
        description:
          "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-900/50 bg-zinc-900 mt-6">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-zinc-800 bg-zinc-900">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : stats ? (
                  <>
                    <p>
                      Are you sure you want to permanently delete your account?
                      This action cannot be undone.
                    </p>
                    <div className="bg-zinc-800 p-3 rounded-md">
                      <p className="font-medium text-zinc-300 mb-2">
                        The following data will be permanently removed:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          {stats.sessions} study session
                          {stats.sessions !== 1 ? "s" : ""}
                        </li>
                        <li>
                          {stats.topics} topic{stats.topics !== 1 ? "s" : ""}
                        </li>
                        {stats.cloudinaryConfigs > 0 && (
                          <li>
                            {stats.cloudinaryConfigs} upload reference
                            {stats.cloudinaryConfigs !== 1 ? "s" : ""}
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
                className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
