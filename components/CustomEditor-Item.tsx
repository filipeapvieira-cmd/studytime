import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorForm from "./CustomEditor-Form";
import { SessionReport, Session } from "@/types";

interface CustomEditorItemProps {
  position: number;
  session: SessionReport;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
  session,
}: CustomEditorItemProps) => {
  const title = session.topic ? session.topic : `Topic - ${position + 1}`;
  return (
    <>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <CustomEditorForm session={session} />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
