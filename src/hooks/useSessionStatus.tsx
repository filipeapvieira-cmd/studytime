import { useContext, useEffect, useState } from "react";
import { TimeContext } from "@/src/ctx/time-provider";

const useSessionStatus = () => {
  const { sessionTimer } = useContext(TimeContext);
  const [status, setStatus] = useState(sessionTimer.status);

  useEffect(() => {
    setStatus(sessionTimer.status);
  }, [sessionTimer]);

  return status;
};

export default useSessionStatus;
