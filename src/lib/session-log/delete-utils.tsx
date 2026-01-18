import { HTTP_METHOD } from "@/src/constants/config";
import { deleteSession, persistSession } from "@/src/lib/session-log/utils";
import type { FullSessionLog } from "@/src/types";

export const getRequestHandler = (
  body: FullSessionLog | undefined,
  url: string,
  method: string,
) => {
  let requestHandler;
  switch (method) {
    case HTTP_METHOD.POST:
    case HTTP_METHOD.PUT:
      {
        requestHandler = persistSession.bind(
          null,
          body as FullSessionLog,
          url,
          method,
        );
      }
      break;
    case HTTP_METHOD.DELETE:
      requestHandler = deleteSession.bind(null, url, method);
      break;
    default:
      requestHandler = () => {};
  }

  return requestHandler;
};
