"use client";

import { Check, ChevronDown, Loader2 } from "lucide-react";
import * as React from "react";
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
import { useTopicTitle } from "@/src/hooks/new/useTopicTitle";
import { cn } from "@/src/lib/utils";

type TopicSubjectSelectionProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function TopicSubjectSelection({
  value,
  onChange,
}: Readonly<TopicSubjectSelectionProps>) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const { topicsList, isLoading, error } = useTopicTitle();

  const handleOnChange = (text: string) => {
    setInputValue(text);
  };

  const handleOnAddingNewTopic = () => {
    //console.log("setting value", inputValue);
    onChange(inputValue.trim());
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
            "w-full  bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 hover:text-white rounded-xl p-3 h-auto shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden",
            isLoading ? "justify-center" : "justify-between",
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {value || "📚 Subject"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800/50 rounded-xl shadow-lg">
        <Command className="bg-transparent">
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
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === topic ? "opacity-100" : "opacity-0",
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
