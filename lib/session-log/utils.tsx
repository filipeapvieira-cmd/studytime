import {
  SessionTimeAndDate,
  Topic,
  FullSessionLog,
  TopicFormatted,
  FullSessionLogUpdate,
} from "@/types";

interface getFullSessionLogProps {
  sessionFeelings: string;
  sessionTopics: Topic[];
  sessionTime: {
    sessionStartTime: number;
    sessionEndTime: number;
    totalPauseTime: number;
  };
}

export const getFullSessionLog = ({
  sessionFeelings,
  sessionTopics,
  sessionTime,
}: getFullSessionLogProps) => {
  return {
    startTime: adaptTimeZone(sessionTime.sessionStartTime),
    endTime: adaptTimeZone(sessionTime.sessionEndTime),
    pauseDuration: sessionTime.totalPauseTime,
    feelingDescription: sessionFeelings,
    topics: getSessionTopics(sessionTopics, sessionTime.sessionEndTime),
  };
};

const getSessionTopics = (
  sessionTopics: Topic[],
  sessionEndTime: number
): TopicFormatted[] => {
  return sessionTopics.map((topic) => {
    let topicId = typeof topic.id === "number" ? topic.id : 0;
    return {
      id: topicId,
      title: topic.title,
      hashtags: topic.hashtags,
      description: topic.description,
      effectiveTimeOfStudy: getTopicTimeOfStudy(topic, sessionEndTime),
    };
  });
};

// Solution for when the component is unmounted on the Accordion
const getTopicTimeOfStudy = (topic: Topic, sessionEndTime: number) => {
  const { status } = topic;
  switch (status) {
    case "play":
      return sessionEndTime - (topic.sessionStartTime + topic.totalPauseTime);
    case "pause": {
      const totalPauseTime =
        topic.totalPauseTime + (sessionEndTime - topic.sessionPauseStartTime);
      return sessionEndTime - (topic.sessionStartTime + totalPauseTime);
    }
    default: {
      return topic.effectiveTimeOfStudy;
    }
  }
};

const formatSessionTime = (
  sessionStartTime: number,
  sessionEndTime: number,
  totalPauseTime: number
): SessionTimeAndDate => {
  return {
    date: new Date(),
    startTime: adaptTimeZone(sessionStartTime),
    endTime: adaptTimeZone(sessionEndTime),
    pausedTime: totalPauseTime,
  };
};

//TODO: REPLACE WITH USE FETCH
export const persistSession = async (
  sessionLog: FullSessionLog | FullSessionLogUpdate,
  url: string,
  method: string
): Promise<void> => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionLog),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Something went wrong");
  }

  const data = await response.json();
  return data;
};

//TODO: REPLACE WITH USE FETCH
export const deleteSession = async (url: string, method: string) => {
  console.log(method);
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Something went wrong");
  }

  const data = await response.json();
  return data;
};

export const adaptTimeZone = (time: number) => {
  const date = new Date(time);
  const localTime = date.getTime() - date.getTimezoneOffset() * 60000;
  const localDate = new Date(localTime);
  return localDate;
};
