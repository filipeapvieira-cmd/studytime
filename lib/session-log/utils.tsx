import {
  SessionLogTopics,
  SessionLogTopicContentFeelings,
  SessionLogTopicContent,
  SessionTimeAndDate,
  SessionLog,
  SessionLogUpdate,
  Topic,
  FullSessionLog,
  TopicFormatted,
} from "@/types";
import { validateTopics } from "@/lib/validations/session-log/validators";
import { getEffectiveTimeOfStudy } from "@/lib/time-provider/utils";

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
    return {
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

const joinTopicsToContent = (
  topics: SessionLogTopics[],
  content: string[]
): SessionLogTopicContent[] => {
  const topicsAndContent: SessionLogTopicContent[] = [];
  topics.forEach((topic, index) => {
    topicsAndContent.push({
      topic: topic.topic,
      subtopic: topic.subtopic,
      content: content[index],
    });
  });
  return topicsAndContent;
};

const joinFeelingsToTopicsAndContent = (
  feelings: string,
  topicsAndContent: SessionLogTopicContent[]
): SessionLogTopicContentFeelings => {
  return {
    topics: topicsAndContent,
    feelings,
  };
};

const getLogTopics = (sessionText: string): SessionLogTopics[] => {
  const lines = sessionText.split("\n").filter((line) => line.includes("@["));
  let pattern = /@\[(.*?)(?:\s-\s(.*?))?\]/g;
  let match: RegExpExecArray | null;
  const topics: SessionLogTopics[] = [];

  lines.forEach((line) => {
    while ((match = pattern.exec(line)) !== null) {
      let topic = match[1].trim();
      let subtopic = match[2] ? match[2].trim() : undefined;
      topics.push({ topic, subtopic });
    }
  });
  validateTopics(topics);
  return topics;
};

const getLogFeelings = (sessionText: string): string => {
  const feelingsStartIndex = sessionText.indexOf("### **Feelings**"); // Find the index of "### **Feelings**"
  let feelings = sessionText.slice(feelingsStartIndex); // Extract the feelings section
  feelings = feelings.split("\n").slice(1).join("\n").trim(); // Remove the first line (the header)
  return feelings;
};

const getLogContent = (sessionText: string): string[] => {
  const topicsIndexes: number[] = [];
  const topicsContent: string[] = [];

  let lines = sessionText.split("\n");
  lines = removeLinesAfterContent(lines);
  lines.forEach(
    (line, index) => line.includes("@[") && topicsIndexes.push(index)
  );

  topicsIndexes.forEach((line, index) => {
    const startIndex = topicsIndexes[index] + 1;
    const endIndex = topicsIndexes[index + 1];
    topicsContent.push(lines.slice(startIndex, endIndex).join("\n").trim());
  });

  return topicsContent;
};

const removeLinesAfterContent = (lines: string[]): string[] => {
  const lastIndex =
    lines.findLastIndex((line) => line.includes("----------")) ||
    lines.length - 1; // Find the index of the last "----------"
  return lines.slice(0, lastIndex);
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

const getDescription = (
  sessionText: string
): SessionLogTopicContentFeelings => {
  const topics = getLogTopics(sessionText);
  const topicsAndContent = joinTopicsToContent(
    topics,
    getLogContent(sessionText)
  );
  const feelings = getLogFeelings(sessionText);
  return joinFeelingsToTopicsAndContent(feelings, topicsAndContent);
};

export const persistSession = async (
  sessionLog: FullSessionLog | SessionLogUpdate,
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
