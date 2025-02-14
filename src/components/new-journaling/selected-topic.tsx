import React from "react";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import { SubjectSelect } from "./topic-input";
import { HashtagInput } from "./hashtag-input";
import { CustomEditor } from "../new-editor/editor";
import { JSONValue } from "@/src/types";
import { getTopicContent } from "@/src/lib/utils";

type SelectedTopicProps = {
  selectedTopicId: string | number | null;
  onEditModalBtnClick: () => void;
};

export default function SelectedTopic({
  selectedTopicId,
  onEditModalBtnClick,
}: SelectedTopicProps) {
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
        <div className="flex items-center space-x-2 w-full">
          <SubjectSelect
            value={selectedTopic?.title}
            onChange={handleOnTopicSelection}
          />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="w-[280px]">
            <HashtagInput
              value={selectedTopic?.hashtags}
              onChange={handleOnHashtagSelection}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-10 w-10 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={onEditModalBtnClick}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CustomEditor
        value={topicContent}
        onBlur={handleContentChange}
        key={selectedTopicId}
      />
    </div>
  );
}
