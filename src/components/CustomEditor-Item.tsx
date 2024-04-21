import { FC, Dispatch, SetStateAction, useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import CustomEditorForm from "@/src/components/CustomEditor-Topic-Form";
import { Topic } from "@/src/types";
import {
  TopicsContext,
  createNewTopic,
} from "@/src/ctx/session-topics-provider";

interface CustomEditorItemProps {
  position: number;
  topic: Topic;
  openAccordionItem: Dispatch<SetStateAction<number>>;
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
  isUpdate: boolean;
  isMarkdownPreviewerVisible: boolean;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  topic,
  openAccordionItem,
  setSessionTopics,
  isUpdate,
  isMarkdownPreviewerVisible,
}: CustomEditorItemProps) => {
  const title = topic.title ? topic.title : `Topic - ${position + 1}`;
  const hashtags = topic.hashtags;

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
          className={`text-left whitespace-nowrap overflow-hidden text-ellipsis ${accordionTriggerSize}`}
        >{`${title} ${hashtags ? `| ${hashtags}` : ""}`}</p>
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
