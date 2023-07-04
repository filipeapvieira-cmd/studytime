/* CONTROL PANEL */

export type SessionTimer = {
    effectiveTimeOfStudy: number;
    status: 'initial' | 'play' | 'pause' | 'stop';
    sessionStartTime: number;
    sessionEndTime: number;
    sessionPauseStartTime: number;
    sessionPauseEndTime: number;
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

/* AUTH */

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

export type UserDetails = {
    name?: string,
    email: string,
    password: string,
};

/* PERSIST SESSION LOG */

export type SessionLogTopics = {
    topic: string;
    subtopic: string | undefined;
};

export type SessionLogTopicContent = {
    topic: string;
    subtopic: string | undefined;
    content: string;
}

export type SessionLogTopicContentFeelings = {
    topics: SessionLogTopicContent[];
    feelings: string;
}

export type SessionTimeAndDate = {
    date: Date;
    startTime: Date;
    endTime: Date;
    pausedTime: number;
}

export type SessionLog = {
    description: SessionLogTopicContentFeelings,
    timeAndDate: SessionTimeAndDate
}

export type SessionLogUpdate = SessionLog & {
    id: number;
}