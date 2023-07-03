import { FC } from "react";
import { Badge } from "./ui/badge";
import Highlight from "./Highlight";
import { sub } from "date-fns";

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
    <div className="flex items-center justify-start gap-1 w-96 flex-grow-0">
      <Badge variant="default" className="rounded-md">
        <Highlight text={topic} searchInput={searchInput} />
      </Badge>
      <Highlight text={subTopic} searchInput={searchInput} />
    </div>
  );
};

export default SessionTopic;
