"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditableTopicItem } from "./editable-topic-item";
import { EditableHashtagItem } from "./editable-hashtag-item";
import { useTopicTitle } from "@/src/hooks/new/useTopicTitle";
import { useHashtags } from "@/src/hooks/new/useHashtags";
import { HashtagItem, TopicItem } from "@/src/types";
import { updateTopicsAndHashtags } from "@/src/actions/update-topics-and-hashtags";
import { mutate } from "swr";
import {
  GET_UNIQUE_HASHTAGS_ENDPOINT,
  GET_UNIQUE_TOPICS_ENDPOINT,
} from "@/src/constants/config";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditModal({ isOpen, onClose }: EditModalProps) {
  const { topicsList: topics, isLoading } = useTopicTitle();
  const { hashtagsList: hashtags } = useHashtags();
  const [isPending, startTransition] = React.useTransition();

  // When the modal opens, convert the plain arrays into objects
  const [localTopics, setLocalTopics] = React.useState<TopicItem[]>(() =>
    topics.map((t) => ({ original: t, current: t }))
  );
  const [localHashtags, setLocalHashtags] = React.useState<HashtagItem[]>(() =>
    hashtags.map((h) => ({ original: h, current: h }))
  );
  const [newHashtag, setNewHashtag] = React.useState("");

  // Update state when topics/hashtags change (for example, if the modal reopens)
  React.useEffect(() => {
    setLocalTopics(topics.map((t) => ({ original: t, current: t })));
  }, [topics]);

  React.useEffect(() => {
    setLocalHashtags(hashtags.map((h) => ({ original: h, current: h })));
  }, [hashtags]);

  const saveUpdates = async (
    topicUpdates: TopicItem[],
    hashtagUpdates: HashtagItem[],
    deletedHashtags: string[]
  ) => {
    startTransition(async () => {
      try {
        const response = await updateTopicsAndHashtags({
          topicUpdates,
          hashtagUpdates,
          deletedHashtags,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        mutate(GET_UNIQUE_TOPICS_ENDPOINT);
        mutate(GET_UNIQUE_HASHTAGS_ENDPOINT);
      }
    });
  };

  const handleSave = async () => {
    // Compute only the updates (i.e. items that have been changed)
    const topicUpdates = localTopics.filter(
      (item) => item.original !== item.current
    );
    const hashtagUpdates = localHashtags.filter(
      (item) => item.original !== item.current
    );
    const deletedHashtags = hashtags.filter(
      (h) => !localHashtags.some((lh) => lh.original === h)
    );

    await saveUpdates(topicUpdates, hashtagUpdates, deletedHashtags);
  };

  const handleClose = () => {
    // Reset the local state to the original values
    setLocalTopics(topics.map((t) => ({ original: t, current: t })));
    setLocalHashtags(hashtags.map((h) => ({ original: h, current: h })));
    onClose();
  };

  const handleAddHashtag = () => {
    if (newHashtag && !localHashtags.find((h) => h.current === newHashtag)) {
      setLocalHashtags([
        ...localHashtags,
        { original: newHashtag, current: newHashtag },
      ]);
      setNewHashtag("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[800px] max-w-[800px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-y-3">
            <h1>Edit Topics and Hashtags</h1>
            <p className="text-sm text-zinc-400 font-normal">
              Any changes you make here will update all study sessions in the
              database that share the same topics and/or hashtags.
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {!isLoading && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Topics</h3>
              <ScrollArea className="h-[300px] pr-4" type="always">
                {localTopics.map((topic) => (
                  <EditableTopicItem
                    key={topic.original}
                    item={topic}
                    onUpdate={(updatedItem) =>
                      setLocalTopics((prev) =>
                        prev.map((t) =>
                          t.original === updatedItem.original ? updatedItem : t
                        )
                      )
                    }
                  />
                ))}
              </ScrollArea>
            </div>
          )}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Hashtags</h3>
            <div className="mb-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddHashtag();
                  }
                }}
                placeholder="Add new hashtag and press Enter"
                className="bg-zinc-800 text-white"
              />
            </div>
            <ScrollArea className="h-[300px] pr-4" type="always">
              {localHashtags.map((hashtag) => (
                <EditableHashtagItem
                  key={hashtag.original}
                  item={hashtag}
                  onUpdate={(updatedItem) =>
                    setLocalHashtags((prev) =>
                      prev.map((h) =>
                        h.original === updatedItem.original ? updatedItem : h
                      )
                    )
                  }
                  onDelete={(itemToDelete) =>
                    setLocalHashtags((prev) =>
                      prev.filter((h) => h.original !== itemToDelete.original)
                    )
                  }
                />
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSave}
            className="bg-white text-zinc-900 hover:bg-zinc-200 border border-zinc-300"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
