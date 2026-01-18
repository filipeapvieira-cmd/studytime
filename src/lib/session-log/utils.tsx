import type {
  FullSessionLog,
  FullSessionLogUpdate,
  SessionTimeAndDate,
  Topic,
  TopicFormatted,
} from "@/src/types";

interface getFullSessionLogProps {
  sessionFeelings: string;
  sessionTopics: Topic[];
  sessionTime: {
    startTime: number;
    endTime: number;
    totalPauseTime: number;
  };
}

export const getFullSessionLog = ({
  sessionFeelings,
  sessionTopics,
  sessionTime,
}: getFullSessionLogProps) => {
  return {
    startTime: adaptTimeZone(sessionTime.startTime),
    endTime: adaptTimeZone(sessionTime.endTime),
    pauseDuration: sessionTime.totalPauseTime,
    feelingDescription: sessionFeelings,
    topics: getSessionTopics(sessionTopics, sessionTime.endTime),
  };
};

const getSessionTopics = (
  sessionTopics: Topic[],
  endTime: number,
): TopicFormatted[] => {
  return sessionTopics.map((topic) => {
    const topicId = typeof topic.id === "number" ? topic.id : 0;
    return {
      id: topicId,
      title: topic.title,
      hashtags: topic.hashtags,
      description: topic.description,
      contentJson: topic.contentJson,
      effectiveTimeOfStudy: getTopicTimeOfStudy(topic, endTime),
    };
  });
};

// Solution for when the component is unmounted on the Accordion
const getTopicTimeOfStudy = (topic: Topic, endTime: number) => {
  const { status } = topic;
  switch (status) {
    case "play":
      return endTime - (topic.startTime + topic.totalPauseTime);
    case "pause": {
      const totalPauseTime =
        topic.totalPauseTime + (endTime - topic.pauseStartTime);
      return endTime - (topic.startTime + totalPauseTime);
    }
    default: {
      return topic.effectiveTimeOfStudy;
    }
  }
};

const formatSessionTime = (
  startTime: number,
  endTime: number,
  totalPauseTime: number,
): SessionTimeAndDate => {
  return {
    date: new Date(),
    startTime: adaptTimeZone(startTime),
    endTime: adaptTimeZone(endTime),
    pausedTime: totalPauseTime,
  };
};

//TODO: REPLACE WITH USE FETCH
export const persistSession = async (
  sessionLog: FullSessionLog | FullSessionLogUpdate,
  url: string,
  method: string,
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
