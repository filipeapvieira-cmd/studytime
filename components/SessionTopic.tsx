import { FC } from "react";
import { Badge } from "./ui/badge";
import Highlight from "./Highlight";
import { sub } from "date-fns";

interface SessionTopicProps {
  title: string;
  hashtags: string;
  searchInput: string;
}

const SessionTopic: FC<SessionTopicProps> = ({
  title,
  hashtags,
  searchInput,
}) => {
  return (
    <div className="flex items-center justify-start gap-1 w-96 flex-grow-0">
      <Badge variant="default" className="rounded-md">
        <Highlight text={title} searchInput={searchInput} />
      </Badge>
      <Highlight text={hashtags} searchInput={searchInput} />
    </div>
  );
};

export default SessionTopic;
