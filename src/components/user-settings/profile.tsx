import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportData } from "./export-data";

export function ProfileSettings() {
  return (
    <div className="space-y-6">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400">This section is still in development.</p>
        </CardContent>
      </Card>

      <ExportData />
    </div>
  );
}
