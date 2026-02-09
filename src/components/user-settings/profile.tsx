import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAccount } from "./delete-account";
import { ExportData } from "./export-data";
import { UserStatsDisplay } from "./user-stats-display";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <UserStatsDisplay />
        </CardContent>
      </Card>

      <ExportData />

      <DeleteAccount />
    </div>
  );
}
