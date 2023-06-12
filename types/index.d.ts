type SessionTimer = {
    currentTimeOfStudy: number;
    status: 'initial' | 'play' | 'pause' | 'stop';
};

export type TimeContextType = {
    sessionTimer: SessionTimer;
    setSessionTimer: (sessionTimer: SessionTimer | ((prevState: SessionTimer) => SessionTimer)) => void;
};