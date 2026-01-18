import { useToast } from "@/src/components/ui/use-toast";

export const useValidation = (validFile: File[]) => {
  const { toast } = useToast();

  const showToast = (description: string) => {
    toast({
      variant: "destructive",
      title: `Uh oh! Something went wrong`,
      description,
    });
  };

  const extensionValidation = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
    ];

    if (!(file.type && validTypes.includes(file.type))) {
      showToast("Invalid file type!");
      return false;
    }
    return true;
  };

  const sizeValidation = (fileSize: number) => {
    if (fileSize === 0 || fileSize > 30000000) {
      showToast(
        `${
          fileSize === 0 ? "File size is 0" : "File size is greater than 30MB"
        }`,
      );
      return false;
    }
    return true;
  };

  const duplicateNameValidation = (fileName: string) => {
    const isDuplicate = validFile.find((file) => file.name === fileName);
    if (isDuplicate) {
      showToast("Duplicate file name!");
      return false;
    }
    return true;
  };

  const isValid = (file: File) =>
    extensionValidation(file) &&
    sizeValidation(file.size) &&
    duplicateNameValidation(file.name);

  return { isValid };
};
