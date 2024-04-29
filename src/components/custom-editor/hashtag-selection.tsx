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
import { GET_UNIQUE_HASHTAGS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import useSWR from "swr";

type HashtagSelectionProps = {
  currentHashtags: string;
  onHashtagSelection: (topic: string) => void;
};

export default function HashtagSelection({
  currentHashtags,
  onHashtagSelection,
}: Readonly<HashtagSelectionProps>) {
  const [customValue, setCustomValue] = React.useState("");
  const [hashtagsList, setHashtagsList] = React.useState<string[]>([]);

  const { data, error } = useSWR(GET_UNIQUE_HASHTAGS_ENDPOINT, fetcher);
  const isLoading = !data && !error;

  let selectedValues =
    (currentHashtags.length > 0 && currentHashtags.split(" ")) || [];

  React.useEffect(() => {
    if (data) {
      setHashtagsList(data.data);
    }
  }, [data]);

  const title = "#Hashtags";

  const handleOnChange = (text: string) => {
    setCustomValue(text);
  };

  const handleOnAddingNewTag = () => {
    selectedValues = [...selectedValues, customValue.trim()];
    setHashtagsList((prev) => [...prev, customValue.trim()].sort());
    onHashtagSelection(selectedValues.join(" "));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn(
            "flex flex-1 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-secondary justify-start",
            isLoading ? "justify-center" : "justify-between"
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              {selectedValues?.length === 0 && title}
              {selectedValues?.length > 0 && (
                <div>
                  <div className="hidden space-x-1 lg:flex">
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
                          className="rounded-sm px-1 font-normal max-w-[100px] truncate"
                        >
                          {`#${option}`}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading && (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
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
                        onHashtagSelection(updatedValues.join(" "));
                      } else {
                        const updatedValues = [...selectedValues, option];
                        onHashtagSelection(updatedValues.join(" "));
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
                    onSelect={() => onHashtagSelection("")}
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
