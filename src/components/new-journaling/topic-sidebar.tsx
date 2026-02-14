"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FEELING_OPTIONS } from "@/src/constants/config";
import { createNewTopic } from "@/src/ctx/session-topics-provider";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import { useJournalingConsent } from "@/src/hooks/useJournalingConsent";
import { cn, getFeelingsDisplayName } from "@/src/lib/utils";
import type { Topic } from "@/src/types";
import SelectedTopic from "./selected-topic";
import { SessionToolbar } from "./session-toolbar";
import TopicComponent from "./topic";

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
  const { consentEnabled, isLoading: consentLoading } = useJournalingConsent();

  const [selectedTopicId, setSelectedTopicId] = React.useState<
    string | number | null
  >(sessionTopics.length > 0 ? sessionTopics[0].id : null);

  const addNewTopic = () => {
    const newTopic = createNewTopic();
    setSessionTopics((prevValue: Topic[]) => [...prevValue, newTopic]);
    setSelectedTopicId(newTopic.id);
  };

  const deleteTopic = (id: string | number) => {
    setSessionTopics((prevValue: Topic[]) =>
      prevValue.filter((currentTopic) => currentTopic.id !== id),
    );
    if (selectedTopicId === id) {
      setSelectedTopicId(null);
    }
  };

  const handleFeelingChange = (newFeeling: string) => {
    setSessionFeelings(newFeeling);
  };

  const selectedTopic =
    sessionTopics.find((topic) => topic.id === selectedTopicId) || null;

  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-186px)] overflow-hidden bg-zinc-900 rounded-xl shadow-lg",
        isUpdate && className,
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
              <Select
                key={sessionFeelings || "empty"}
                value={sessionFeelings || undefined}
                onValueChange={handleFeelingChange}
                disabled={!consentEnabled || consentLoading}
              >
                <SelectTrigger className="w-full bg-zinc-900/50 text-white border-zinc-800/50">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {FEELING_OPTIONS.map((feeling) => (
                    <SelectItem key={feeling} value={feeling}>
                      {getFeelingsDisplayName(feeling)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!consentEnabled && !consentLoading && (
                <div className="mt-2 rounded-md border border-amber-800/50 bg-amber-950/30 px-3 py-2 text-xs text-amber-300">
                  <Link
                    href="/settings/privacy"
                    className="underline hover:text-amber-100"
                  >
                    Enable consent in Settings
                  </Link>{" "}
                  to use this optional feelings feature.
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-3">
            {!consentEnabled && !consentLoading && (
              <div className="mb-3 rounded-md border border-amber-800/50 bg-amber-950/30 px-4 py-2 text-sm text-amber-300">
                Journaling is disabled.{" "}
                <Link
                  href="/settings/privacy"
                  className="underline hover:text-amber-100"
                >
                  Enable consent in Settings
                </Link>{" "}
                to record reflections.
              </div>
            )}
            {selectedTopic ? (
              <SelectedTopic
                selectedTopicId={selectedTopicId}
                consentEnabled={consentEnabled}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Select a topic or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
