import { useToast } from "@/components/ui/use-toast";

interface showToastProps {
  status: "success" | "error";
  message: string;
  data: any;
}

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = (obj: showToastProps) => {
    const variant = obj.status === "success" ? "default" : "destructive";
    const title =
      obj.status === "success" ? "Success" : "Uh oh! Something went wrong";
    const description = obj.message;

    toast({
      variant,
      title,
      description,
    });
  };

  return { showToast };
};
