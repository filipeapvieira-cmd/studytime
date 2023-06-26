import { useCustomToast } from "@/src/hooks/useCustomToast";

export const useFetchStatusToastHandling = () => {
    const { showToast } = useCustomToast();

    const showToastError = (error: any) => {
      let message = "Unable to connect, please try again later";

      if (error instanceof Error) {
        message = error.message;
      }

      showToast({
        status: "error",
        message,
        data: null,
      });
    }

    const showToastSuccess = (response: any) => {
        showToast(response);
    }

    return {
      showToastError,
      showToastSuccess,
    }

}