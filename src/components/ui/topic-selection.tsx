"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import * as React from "react";
import useSWR from "swr";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { GET_UNIQUE_TOPICS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { cn } from "@/src/lib/utils";

type TopicSelectionProps = {
  currentTopic: string;
  onTopicSelection: (topic: string) => void;
};

export function TopicSelection({
  currentTopic,
  onTopicSelection,
}: Readonly<TopicSelectionProps>) {
  const [open, setOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");
  const [topicsList, setTopicsList] = React.useState<string[]>([]);

  const { data, error } = useSWR(GET_UNIQUE_TOPICS_ENDPOINT, fetcher);
  const isLoading = !data && !error;

  React.useEffect(() => {
    if (data) {
      setTopicsList(data.data);
    }
  }, [data]);

  const handleOnChange = (text: string) => {
    setCustomValue(text);
  };

  const handleOnAddingNewTopic = () => {
    //console.log("setting value", customValue);
    onTopicSelection(customValue.trim());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-secondary",
            isLoading ? "justify-center" : "justify-between",
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {currentTopic || "Subject"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Subject"
            onValueChange={handleOnChange}
            onAddingNewTopic={handleOnAddingNewTopic}
          />
          <CommandEmpty>No Subject found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {topicsList.map((topic) => (
                <CommandItem
                  key={topic}
                  value={topic}
                  onSelect={(currentValue) => {
                    onTopicSelection(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentTopic === topic ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {topic}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
