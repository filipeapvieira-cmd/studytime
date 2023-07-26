import { FC, Dispatch, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorForm from "@/components/CustomEditor-Topic-Form";
import { SessionReport, Session } from "@/types";

interface CustomEditorItemProps {
  position: number;
  session: SessionReport;
  openAccordionItem: Dispatch<SetStateAction<number>>;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  session,
  openAccordionItem,
}: CustomEditorItemProps) => {
  const title = session.topic ? session.topic : `Topic - ${position + 1}`;
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
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <CustomEditorForm session={session} />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
