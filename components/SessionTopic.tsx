import { FC } from "react";
import { Badge } from "./ui/badge";
import Highlight from "./Highlight";

interface SessionTopicProps {
  topic: string;
  subTopic: string;
  searchInput: string;
}

const SessionTopic: FC<SessionTopicProps> = ({
  topic,
  subTopic,
  searchInput,
}) => {
  return (
    <div className="rounded-md border-border p-2 flex items-center justify-start gap-3">
      <Badge variant="default" className="rounded-md">
        <Highlight text={topic} searchInput={searchInput} />
      </Badge>
      <p className="text-sm">
        <Highlight text={subTopic} searchInput={searchInput} />
      </p>
    </div>
  );
};

export default SessionTopic;
