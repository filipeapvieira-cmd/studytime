import { FC, Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorForm from "@/components/CustomEditor-Topic-Form";
import { Topic, Session } from "@/types";

interface CustomEditorItemProps {
  position: number;
  topic: Topic;
  openAccordionItem: Dispatch<SetStateAction<number>>;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  topic,
  openAccordionItem,
}: CustomEditorItemProps) => {
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
        <CustomEditorForm topic={topic} />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
