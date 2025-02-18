"use client";

import * as React from "react";
import { CheckIcon, ChevronDown, Hash, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "../ui/badge";
import { useHashtags } from "@/src/hooks/new/useHashtags";

type TopicHashtagSelectionProps = {
  value?: string;
  onChange: (value: string) => void;
};

export default function TopicHashtagSelection({
  value,
  onChange,
}: Readonly<TopicHashtagSelectionProps>) {
  const [customValue, setCustomValue] = React.useState("");
  const { hashtagsList, isLoading, error, setHashtagsList } = useHashtags();

  let selectedValues = (value && value?.length > 0 && value?.split(" ")) || [];
  const title = "#Hashtags";

  const handleOnChange = (text: string) => {
    setCustomValue(text);
  };

  const handleOnAddingNewTag = () => {
    if (customValue.trim() === "") return;
    selectedValues = [...selectedValues, customValue.trim()];
    setHashtagsList((prev) => [...prev, customValue.trim()].sort());
    onChange(selectedValues.join(" "));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn(
            "w-full bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 hover:text-white rounded-xl p-3 h-auto              shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden",
            isLoading ? "justify-center" : "justify-between"
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {selectedValues?.length === 0 && title}
              {selectedValues?.length > 0 && (
                <div className="space-x-1 lg:flex">
                  {selectedValues?.length > 3 ? (
                    <Badge
                      variant="default"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues?.length} selected
                    </Badge>
                  ) : (
                    selectedValues?.map((option) => (
                      <Badge
                        variant="default"
                        key={option}
                        className=" rounded-sm px-1 font-normal max-w-[100px] truncate"
                      >
                        {`#${option}`}
                      </Badge>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {!isLoading && (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-zinc-900 border-zinc-800/50 rounded-xl shadow-lg"
        align="start"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder={title}
            onValueChange={handleOnChange}
            onAddingNewTopic={handleOnAddingNewTag}
          />
          <CommandList>
            <CommandEmpty>No Hashtag found.</CommandEmpty>
            <CommandGroup>
              {hashtagsList.map((option) => {
                const isSelected = selectedValues?.includes(option);
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        const updatedValues = selectedValues?.filter(
                          (value) => value !== option
                        );
                        onChange(updatedValues.join(" "));
                      } else {
                        const updatedValues = [...selectedValues, option];
                        onChange(updatedValues.join(" "));
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <Hash className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues?.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange("")}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
