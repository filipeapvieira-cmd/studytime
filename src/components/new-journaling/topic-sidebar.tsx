"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import { createNewTopic } from "@/src/ctx/session-topics-provider";
import { Topic } from "@/src/types";
import TopicComponent from "./topic";
import SelectedTopic from "./selected-topic";
import { SessionToolbar } from "./session-toolbar";
import { cn } from "@/src/lib/utils";
import { EditModal } from "../new-update-session/edit-modal";

const feelingOptions = ["VERY_GOOD", "GOOD", "NEUTRAL", "BAD", "VERY_BAD"];

type TopicSidebarProps = {
  className?: string;
};

export function TopicSidebar({ className }: TopicSidebarProps) {
  const {
    sessionFeelings,
    setSessionFeelings,
    sessionTopics,
    setSessionTopics,
    isUpdate,
  } = useFeelingsAndTopics();

  const [selectedTopicId, setSelectedTopicId] = React.useState<
    string | number | null
  >(null);
  const [feeling, setFeeling] = React.useState<string | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const addNewTopic = () => {
    const newTopic = createNewTopic();
    setSessionTopics((prevValue: Topic[]) => [...prevValue, newTopic]);
    setSelectedTopicId(newTopic.id);
  };

  const deleteTopic = (id: string | number) => {
    setSessionTopics((prevValue: Topic[]) =>
      prevValue.filter((currentTopic) => currentTopic.id !== id)
    );
    if (selectedTopicId === id) {
      setSelectedTopicId(null);
    }
  };

  const handleFeelingChange = (newFeeling: string) => {
    setFeeling(newFeeling);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const selectedTopic =
    sessionTopics.find((topic) => topic.id === selectedTopicId) || null;

  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-186px)] overflow-hidden bg-zinc-900 rounded-xl shadow-lg",
        isUpdate && className
      )}
    >
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-6xl mx-auto w-full flex">
          <div className="w-64 border-r flex flex-col mr-4">
            {!isUpdate && <SessionToolbar />}
            <Separator className="my-2 bg-zinc-800" />
            <div className="px-4 py-2">
              <Button
                onClick={addNewTopic}
                className="w-full bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl shadow-lg font-medium"
              >
                New Topic
              </Button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea
                className="flex-1 h-[calc(100vh-20.5rem)]"
                type="always"
              >
                <div className="p-2 space-y-3">
                  {sessionTopics.map((topic) => (
                    <TopicComponent
                      topic={topic}
                      key={topic.id}
                      selectedTopicId={selectedTopicId}
                      setSelectedTopicId={setSelectedTopicId}
                      deleteTopic={deleteTopic}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Separator className="my-2 bg-zinc-800" />
            <div className="p-4 pt-0 space-y-2">
              <Label htmlFor="feeling" className="text-white">
                Feelings:
              </Label>
              <Select value={feeling} onValueChange={handleFeelingChange}>
                <SelectTrigger className="w-full bg-zinc-900/50 text-white border-zinc-800/50">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {feelingOptions.map((feeling) => (
                    <SelectItem key={feeling} value={feeling}>
                      {feeling.charAt(0) +
                        feeling.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-3">
            {selectedTopic ? (
              <SelectedTopic
                selectedTopicId={selectedTopicId}
                onEditModalBtnClick={handleOpenEditModal}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Select a topic or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
      <EditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} />
    </div>
  );
}
