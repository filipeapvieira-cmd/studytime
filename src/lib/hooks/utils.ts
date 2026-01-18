import type { Topic, TopicFormatted } from "@/src/types";

const convertTopicFormattedToTopic = (topic: TopicFormatted): Topic => {
  const {
    id,
    title,
    hashtags,
    description,
    effectiveTimeOfStudy,
    contentJson,
  } = topic;

  //TODO: handle error
  if (!id) {
    throw new Error("Id is not available");
  }

  return {
    id,
    title,
    hashtags,
    description,
    effectiveTimeOfStudy,
    contentJson,
    status: "stop",
    startTime: 0,
    endTime: 0,
    pauseStartTime: 0,
    pauseEndTime: 0,
    totalPauseTime: 0,
  };
};

export const convertListToTopic = (topicList: TopicFormatted[]): Topic[] => {
  return topicList.map((topic) => convertTopicFormattedToTopic(topic));
};
