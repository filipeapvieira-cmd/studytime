import { useEffect } from "react";
import { useToast } from "@/src/components/ui/use-toast";

export const useErrorToast = (
  error: any,
  message: string = "Something went wrong",
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: message,
      });
    }
  }, [error, toast, message]);
};
