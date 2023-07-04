"use client";

import { createContext, useState } from "react";
import { StudySession } from "@/types/tanstack-table";

type SetSession = React.Dispatch<React.SetStateAction<StudySession[]>>;
type EditSessionsCtx = { sessions: StudySession[]; setSessions: SetSession };

export const editSessionsCtxDefaultValues: EditSessionsCtx = {
  sessions: [],
  setSessions: () => {},
};
export const EditSessionContext = createContext(editSessionsCtxDefaultValues);

interface EditSessionProviderProps {
  children: React.ReactNode;
}

export default function EditSessionProvider({
  children,
}: EditSessionProviderProps) {
  const [sessions, setSessions] = useState<StudySession[]>(
    editSessionsCtxDefaultValues.sessions
  );

  return (
    <EditSessionContext.Provider value={{ sessions, setSessions }}>
      {children}
    </EditSessionContext.Provider>
  );
}
