import React from "react";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import { CustomEditor } from "../new-editor/editor";
import { JSONValue } from "@/src/types";
import { getTopicContent } from "@/src/lib/utils";
import { TopicSubjectSelection } from "./topic-subject-selection";
import TopicHashtagSelection from "./topic-hashtag-selection";

type SelectedTopicProps = {
  selectedTopicId: string | number | null;
};

export default function SelectedTopic({ selectedTopicId }: SelectedTopicProps) {
  const { sessionTopics, setSessionTopics } = useFeelingsAndTopics();

  const selectedTopic = sessionTopics.find(
    (topic) => topic.id === selectedTopicId
  );

  const topicContent = getTopicContent(selectedTopic);

  const handleOnTopicSelection = (topic: string) => {
    setSessionTopics((prevValue) => {
      return prevValue.map((prevTopic) => {
        if (prevTopic.id === selectedTopicId) {
          return { ...prevTopic, title: topic };
        }
        return prevTopic;
      });
    });
  };

  const handleOnHashtagSelection = (hashtags: string) => {
    setSessionTopics((prevValue) => {
      return prevValue.map((prevTopic) => {
        if (prevTopic.id === selectedTopicId) {
          return { ...prevTopic, hashtags };
        }
        return prevTopic;
      });
    });
  };

  const handleContentChange = (contentJson: JSONValue) => {
    setSessionTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === selectedTopicId ? { ...topic, contentJson } : topic
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center w-full">
          <TopicSubjectSelection
            value={selectedTopic?.title}
            onChange={handleOnTopicSelection}
          />
        </div>
        <div className="flex items-center w-full">
          <TopicHashtagSelection
            value={selectedTopic?.hashtags}
            onChange={handleOnHashtagSelection}
          />
        </div>
      </div>
      <CustomEditor
        value={topicContent}
        onSave={handleContentChange}
        key={selectedTopicId}
      />
    </div>
  );
}
