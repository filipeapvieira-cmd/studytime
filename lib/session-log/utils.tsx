import { SessionLogContent } from "@/types";

export const getLogContent = (content: string) => {  
  let lines = content.split("#### @[").slice(1); // The first element is the text before the first '@[', so we skip it
  removeLinesAfterContent(lines);
  console.log(parseLogContent(lines));
  return parseLogContent(lines); 
}

const removeLinesAfterContent = (lines: string[]): void => {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = lines[lastIndex].split("----------")[0]; // Remove "----------" and everything after it
}

const parseLogContent = (lines: string[]): SessionLogContent[] => {
    console.log(lines);
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
          let content = lines[i].split("\n").slice(1, -1).join("\n").trim(); // Remove the first and last line of each line
          topicContents.push({ topic, subtopic, content });
        }
      }
      return topicContents;
}  