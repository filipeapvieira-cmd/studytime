"use client";
import { FC, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorItem from "./CustomEditor-Item";

interface CustomEditorProps {}

const CustomEditor: FC<CustomEditorProps> = ({}) => {
  const [items, setItems] = useState([
    {
      topic: "",
      hashtags: "",
      content: "",
      startTime: 0,
      endTime: 0,
    },
    {
      topic: "",
      hashtags: "",
      content: "",
    },
  ]);

  return (
    <Accordion type="multiple" defaultValue={[String(0)]}>
      {items.map((item, index) => (
        <AccordionItem value={String(index)} key={index} data-state="open">
          <CustomEditorItem position={index} />
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CustomEditor;
