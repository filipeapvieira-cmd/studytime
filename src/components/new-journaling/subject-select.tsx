"use client";

import * as React from "react";
import { Check, ChevronsUpDown, HelpCircle, Loader2 } from "lucide-react";
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
import { GET_UNIQUE_TOPICS_ENDPOINT } from "@/src/constants/config";
import { fetcher } from "@/src/lib/swr/utils";

interface SubjectSelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function SubjectSelect({ value, onChange }: SubjectSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [topicsList, setTopicsList] = React.useState<string[]>([]);

  const { data, error } = useSWR(GET_UNIQUE_TOPICS_ENDPOINT, fetcher);
  const isLoading = !data && !error;

  React.useEffect(() => {
    if (data) {
      setTopicsList(data.data);
    }
  }, [data]);

  const handleSelect = (selectedSubject: string) => {
    onChange(selectedSubject === value ? "" : selectedSubject);
    setOpen(false);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
      const newSubject = inputValue.trim();
      if (!topicsList.includes(newSubject)) {
        setInputValue(newSubject);
      }
      handleSelect(newSubject);
    }
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
            isLoading ? "justify-center" : "justify-between"
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="truncate flex-grow text-left mr-2">
                {value || "Select subject..."}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 flex-none" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-zinc-900 border-zinc-800/50 rounded-xl shadow-lg">
        <Command className="bg-transparent">
          <div className="relative">
            <CommandInput
              placeholder="Add subject"
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
                  <p>Type a subject and press Enter to add it</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {topicsList.map((topicTitle) => (
                <CommandItem
                  key={topicTitle}
                  onSelect={() => handleSelect(topicTitle)}
                  className="text-zinc-300 hover:bg-zinc-800 hover:text-white aria-selected:bg-zinc-800 flex justify-between"
                >
                  <span className="truncate max-w-[280px] block">
                    {topicTitle}
                  </span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 flex-none",
                      value === topicTitle ? "opacity-100" : "opacity-0"
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
