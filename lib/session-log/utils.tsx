import { SessionLogTopics, SessionLogTopicContentFeelings, SessionLogTopicContent, SessionTimeAndDate, SessionLog } from "@/types";

export const getSessionLog = (sessionText: string, sessionStartTime:number, sessionEndTime:number, totalPauseTime:number): SessionLog => {
    return {
        description: getDescription(sessionText),
        timeAndDate: getSessionTimeAndDate(sessionStartTime, sessionEndTime, totalPauseTime),
    }    
}

const joinTopicsToContent = (topics: SessionLogTopics[], content: string[]): SessionLogTopicContent[] => {
    const topicsAndContent: SessionLogTopicContent[] = [];
    topics.forEach((topic, index) => {
        topicsAndContent.push({
            topic: topic.topic,
            subtopic: topic.subtopic,
            content: content[index]        
        });
    });
    return topicsAndContent;
}

const joinFeelingsToTopicsAndContent = (feelings: string, topicsAndContent: SessionLogTopicContent[]): SessionLogTopicContentFeelings => {
    return {
        topics: topicsAndContent,
        feelings,
    }
}

const getLogTopics = (sessionText: string): SessionLogTopics[] => {
    const lines = sessionText.split("\n").filter(line => line.includes("@["));
    let pattern = /@\[(.*?)(?:\s-\s(.*?))?\]/g;
    let match: RegExpExecArray | null;
    const topics: SessionLogTopics[] = [];

    lines.forEach(line => {
        while ((match = pattern.exec(line)) !== null) {
            let topic = match[1].trim();
            let subtopic = match[2] ? match[2].trim() : undefined;
            topics.push({topic, subtopic});
        };
    });
    return topics;     
};

const getLogFeelings = (sessionText: string): string => {
    const feelingsStartIndex = sessionText.indexOf("### **Feelings**"); // Find the index of "### **Feelings**"
    let feelings = sessionText.slice(feelingsStartIndex); // Extract the feelings section
    feelings = feelings.split("\n").slice(1).join("\n").trim(); // Remove the first line (the header)
    return feelings;
};

const getLogContent = (sessionText: string): string[] => {
    const topicsIndexes: number[] = [];
    const topicsContent: string[] = [];

    let lines = sessionText.split("\n");
    lines = removeLinesAfterContent(lines);
    lines.forEach((line, index) => line.includes("@[") && topicsIndexes.push(index));

    topicsIndexes.forEach((line, index) => {
        const startIndex = topicsIndexes[index] + 1;
        const endIndex = topicsIndexes[index + 1];
        topicsContent.push(lines.slice(startIndex, endIndex).join("\n").trim());
    });

    return topicsContent;
}

const removeLinesAfterContent = (lines: string[]): string[] => {    
    const lastIndex = lines.findLastIndex(line => line.includes("----------")) || lines.length - 1; // Find the index of the last "----------"
    return lines.slice(0, lastIndex);
}

const getSessionTimeAndDate = (sessionStartTime:number, sessionEndTime:number, totalPauseTime:number): SessionTimeAndDate => {

    /*     
    RETURN DATE AS STRING
    const timeFormatOptions :Intl.DateTimeFormatOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateFormatOptions :Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };
    return {
        date: new Date().toLocaleDateString('en-GB', dateFormatOptions).replace(/\//g, '-'),
        startTime: new Date(sessionStartTime).toLocaleTimeString([], timeFormatOptions ),
        endTime: new Date(sessionEndTime).toLocaleTimeString([], timeFormatOptions ),
        pausedTime: totalPauseTime,
    } 
    */
   return {
    date: new Date(),
    startTime: new Date(sessionStartTime),
    endTime: new Date(sessionEndTime),
    pausedTime: totalPauseTime,
   }
}

const getDescription = (sessionText: string): SessionLogTopicContentFeelings => {
    const topics = getLogTopics(sessionText);
    const topicsAndContent = joinTopicsToContent(topics, getLogContent(sessionText));
    const feelings = getLogFeelings(sessionText);
    return joinFeelingsToTopicsAndContent(feelings, topicsAndContent);
};

export const persistSession = async (sessionLog: SessionLog): Promise<void> => {
    const response = await fetch("/api/session/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionLog)
      });
  
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      return data;
}