import { FC, Dispatch, SetStateAction } from "react";
import {
  AccordionContent,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import CustomEditorForm from "@/src/components/CustomEditor-Topic-Form";
import { Topic } from "@/src/types";
import { cn } from "../lib/utils";
import { useUpdateSessionContext } from "../ctx/update-session-provider";

interface CustomEditorItemProps {
  position: number;
  topic: Topic;
  openAccordionItem: Dispatch<SetStateAction<number>>;
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
  isMarkdownPreviewerVisible: boolean;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  topic,
  openAccordionItem,
  setSessionTopics,
  isMarkdownPreviewerVisible,
}: CustomEditorItemProps) => {
  const { sessionToEdit: currentSession } = useUpdateSessionContext();
  const isUpdate = !!currentSession;

  const title = topic.title ? topic.title : `📚 Subject`;

  const accordionTriggerSize = isMarkdownPreviewerVisible
    ? "max-w-[523px]"
    : "w-full";
  return (
    <>
      <AccordionTrigger
        className={`hover:no-underline bg-secondary hover:bg-foreground hover:text-background p-2 border-b-[1px] border-primary`}
        onClick={() => {
          openAccordionItem((visibleIndex) => {
            const indexToShow = visibleIndex === position ? -1 : position;
            return indexToShow;
          });
        }}
      >
        <p
          className={cn(
            "text-left whitespace-nowrap overflow-hidden text-ellipsis",
            accordionTriggerSize
          )}
        >
          {title}
        </p>
      </AccordionTrigger>
      <AccordionContent>
        <CustomEditorForm
          topic={topic}
          setSessionTopics={setSessionTopics}
          isUpdate={isUpdate}
        />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
