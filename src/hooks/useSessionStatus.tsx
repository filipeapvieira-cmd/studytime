import { useContext, useEffect, useState } from "react";
import { TimeContext, useTimeContext } from "@/src/ctx/time-provider";

const useSessionStatus = () => {
  const { Timer } = useTimeContext();
  const [status, setStatus] = useState(Timer.status);

  useEffect(() => {
    setStatus(Timer.status);
  }, [Timer]);

  return status;
};

export default useSessionStatus;
