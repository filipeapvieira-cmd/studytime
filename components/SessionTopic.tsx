import { FC } from "react";
import { Badge } from "./ui/badge";
import { sub } from "date-fns";

interface SessionTopicProps {
  topic: string;
  subTopic: string;
}

const SessionTopic: FC<SessionTopicProps> = ({ topic, subTopic }) => {
  return (
    <div className="rounded-md border-border p-2 flex items-center justify-start gap-3">
      <Badge variant="default" className="rounded-md">
        {topic}
      </Badge>
      <p className="text-sm">{subTopic}</p>
    </div>
  );
};

export default SessionTopic;
