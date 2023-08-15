import { FC, Dispatch, SetStateAction, useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorForm from "@/components/CustomEditor-Topic-Form";
import { Topic } from "@/types";
import {
  TopicsContext,
  createNewTopic,
} from "@/src/ctx/session-topics-provider";

interface CustomEditorItemProps {
  position: number;
  topic: Topic;
  openAccordionItem: Dispatch<SetStateAction<number>>;
  setSessionTopics: Dispatch<SetStateAction<Topic[]>>;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  topic,
  openAccordionItem,
  setSessionTopics,
}: CustomEditorItemProps) => {
  const { sessionTopics } = useContext(TopicsContext);
  const title = topic.title ? topic.title : `Topic - ${position + 1}`;
  const hashtags = topic.hashtags;
  return (
    <>
      <AccordionTrigger
        className="hover:no-underline hover:bg-foreground hover:text-background rounded-md p-2"
        onClick={() => {
          openAccordionItem((visibleIndex) => {
            const indexToShow = visibleIndex === position ? -1 : position;
            return indexToShow;
          });
        }}
      >
        {`${title} ${hashtags ? `| ${hashtags}` : ""}`}
      </AccordionTrigger>
      <AccordionContent>
        <CustomEditorForm topic={topic} setSessionTopics={setSessionTopics} />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
