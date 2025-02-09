"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Hash, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWR from "swr";
import { GET_UNIQUE_HASHTAGS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";
import { Badge } from "../ui/badge";

interface HashtagInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export function HashtagInput({ value, onChange }: HashtagInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [hashtagsList, setHashtagsList] = React.useState<string[]>([]);

  const { data, error } = useSWR(GET_UNIQUE_HASHTAGS_ENDPOINT, fetcher);
  const isLoading = !data && !error;

  let selectedValues = (value && value?.length > 0 && value?.split(" ")) || [];

  React.useEffect(() => {
    if (data) {
      setHashtagsList(data.data);
    }
  }, [data]);

  const handleSelect = (selectedHashtag: string) => {
    onChange(
      selectedValues.includes(selectedHashtag)
        ? selectedValues.filter((v) => v !== selectedHashtag).join(" ")
        : [...selectedValues, selectedHashtag].join(" ")
    );
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
      const newHashtag = inputValue.trim().toLowerCase();

      if (!hashtagsList.includes(newHashtag)) {
        setHashtagsList((prev) => [...prev, newHashtag].sort());
      }

      if (value && !value.includes(newHashtag)) {
        onChange(value?.concat(" ", newHashtag));
      }
      setInputValue("");
    }
  };

  const hashtagInputStyles = {
    wrapper: "flex-grow min-w-0 w-[280px]",
  };

  const PLACEHOLDER = "Add hashtag";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={hashtagInputStyles.wrapper}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full bg-zinc-900/50 text-white border-zinc-800/50 hover:bg-zinc-800/50 hover:text-white rounded-xl p-3 h-auto              shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden",
              isLoading ? "justify-center" : "justify-between"
            )}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {selectedValues?.length === 0 && PLACEHOLDER}
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
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
            )}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800/50 rounded-xl shadow-lg">
        <Command className="bg-transparent">
          <div className="relative">
            <CommandInput
              placeholder={PLACEHOLDER}
              className="text-white pr-8 [&_svg]:text-zinc-400"
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-zinc-800"
                  >
                    <HelpCircle className="h-4 w-4 text-zinc-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-zinc-800 text-zinc-100"
                >
                  <p>Type a hashtag and press Enter to add it</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CommandList>
            <CommandEmpty>
              <p className="text-xs text-zinc-400 py-2 px-3">
                No hashtags found.
              </p>
            </CommandEmpty>
            <CommandGroup>
              {hashtagsList.map((hashtag) => (
                <CommandItem
                  key={hashtag}
                  onSelect={() => handleSelect(hashtag)}
                  className="text-zinc-300 hover:bg-zinc-800 hover:text-white aria-selected:bg-zinc-800 flex justify-between"
                >
                  <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    {hashtag}
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(hashtag)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
