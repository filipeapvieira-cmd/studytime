import { SessionLogTopics } from "@/types";

// Validate Content
export const validateTopics = (topics: SessionLogTopics[]) => {
  if (topics.length === 0) {
    console.log("Topics not found");
    //throw new Error("Topics not found");
  }
  //console.log(topics);
};
