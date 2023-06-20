export type SessionTimer = {
    currentTimeOfStudy: number;
    status: 'initial' | 'play' | 'pause' | 'stop';
    sessionStartTime: number;
    sessionEndTime: number;
    totalPauseTime: number;
};

export type TimeContextType = {
    sessionTimer: SessionTimer;
    setSessionTimer: (sessionTimer: SessionTimer | ((prevState: SessionTimer) => SessionTimer)) => void;
};

type SessionChrono = {
    seconds: number;
    isActive: boolean;
}

export type ChronoContextType = {
    sessionChrono: SessionChrono;
    setSessionChrono: (sessionChrono: SessionChrono | ((prevState: SessionChrono) => SessionChrono)) => void;
}


export type ControlText = {
    action: "restartSession" | "stopSession" | "saveSession";
}

export type ValidationRules = {
    [key: string]: (value: string, password?: string) => string | undefined;
};

export type FormState = {
    name?: string | undefined;
    email: string;
    password: string;
    confirmPassword?: string | undefined;
};

export type ErrorState = {
    name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
  };