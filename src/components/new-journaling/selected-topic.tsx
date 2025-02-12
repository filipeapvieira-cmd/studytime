import React from "react";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import { SubjectSelect } from "./subject-select";
import { HashtagInput } from "./hashtag-input";

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

  const handleOnDescriptionChange = (description: string) => {
    setSessionTopics((prevValue) => {
      return prevValue.map((prevTopic) => {
        if (prevTopic.id === selectedTopicId) {
          return { ...prevTopic, description };
        }
        return prevTopic;
      });
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
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

      <textarea
        className="w-full flex-1 p-3 rounded-xl border border-zinc-800/50 
                  bg-zinc-900/50 text-white placeholder-zinc-500
                  resize-none focus:outline-none focus:ring-2 focus:ring-zinc-700
                  shadow-[0_0_15px_rgba(0,0,0,0.1)]"
        value={selectedTopic?.description}
        onChange={(e) => handleOnDescriptionChange(e.target.value)}
        placeholder="Enter description..."
      />
    </div>
  );
}
