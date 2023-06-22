import { SessionLogContent } from "@/types";

export const getLogContent = (content: string) => {  
  let lines = content.split("#### @[").slice(1); // The first element is the text before the first '@[', so we skip it
  lines = removeFeelingsFromLog(lines);
  return parseLogContent(lines);    
}

const removeFeelingsFromLog = (lines: string[]): string[] => {
    const lastLineIndex = lines.length - 1;
    const feelingsFlag = "### **Feelings**";
    
    if (lines[lastLineIndex].includes(feelingsFlag)) {
      lines[lastLineIndex] = lines[lastLineIndex].split(feelingsFlag)[0];
    }
  
    return lines;
  }

const parseLogContent = (lines: string[]): SessionLogContent[] => {
  /*
  will match any string that starts with "@[", 
  then has any number of any characters (the topic), 
  then optionally has a space, a dash, another space, and any number of any characters (the subtopic), 
  before finally ending with a "]"
  */
  let pattern = /@\[(.*?)(?:\s-\s(.*?))?\]/g;
    let match;
    const topicContents: SessionLogContent[] = [];
    for (let i = 0; i < lines.length; i++) {
        while ((match = pattern.exec("@[" + lines[i])) !== null) {
          let topic = match[1].trim();
          let subtopic = match[2] ? match[2].trim() : undefined;
          let content = lines[i].split("\n").slice(1).join("\n").trim();
          topicContents.push({ topic, subtopic, content });
        }
      }
      return topicContents;
}  