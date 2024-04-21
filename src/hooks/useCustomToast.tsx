import { useToast } from "@/src/components/ui/use-toast";

type ShowToastProps = {
  status: "success" | "error";
  message: string;
};

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = (obj: ShowToastProps) => {
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
