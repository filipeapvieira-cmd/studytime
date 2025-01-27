import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function MobileMessage() {
  return (
    <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 bg-black/40 border-purple-500/20">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Mobile Version in Development
            </h1>
            <p className="text-gray-400 text-lg">
              We&apos;re crafting something special for your mobile experience.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              In the meantime, please visit us on desktop for the full
              experience
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
