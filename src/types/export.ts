export type PersonalDataExport = {
  version: number;
  generatedAt: string;
  user: ExportedUser;
  records: {
    studySessions: ExportedStudySession[];
  };
};

export type ExportedUser = {
  id: number;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ExportedTopic = {
  id: number;
  sessionId: number;
  description: string | null;
  title: string;
  hashtags: string | null;
  timeOfStudy: number;
  createdAt: Date;
  updatedAt: Date;
  contentJson: any; // Using any for JSON content flexibility
};

export type ExportedFeeling = {
  id: number;
  sessionId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExportedStudySession = {
  id: number;
  startTime: Date;
  endTime: Date;
  pauseDuration: number;
  createdAt: Date;
  updatedAt: Date;
  topic: ExportedTopic[];
  feeling: ExportedFeeling | null;
};
