import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorForm from "./CustomEditor-Form";

interface CustomEditorItemProps {
  position: number;
}

const CustomEditorItem: FC<CustomEditorItemProps> = ({
  position,
}: CustomEditorItemProps) => {
  return (
    <>
      <AccordionTrigger>{`Topic - ${position + 1}`}</AccordionTrigger>
      <AccordionContent>
        <CustomEditorForm />
      </AccordionContent>
    </>
  );
};

export default CustomEditorItem;
