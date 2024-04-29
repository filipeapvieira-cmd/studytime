import { Topic, TopicFormatted } from "@/src/types";

const convertTopicFormattedToTopic = (topic: TopicFormatted): Topic => {
  const { id, title, hashtags, description, effectiveTimeOfStudy } = topic;

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
    status: "stop",
    sessionStartTime: 0,
    sessionEndTime: 0,
    sessionPauseStartTime: 0,
    sessionPauseEndTime: 0,
    totalPauseTime: 0,
  };
};

export const convertListToTopic = (topicList: TopicFormatted[]): Topic[] => {
  return topicList.map((topic) => convertTopicFormattedToTopic(topic));
};
