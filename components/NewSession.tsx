import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import alerts from "@/text/alerts.json";

interface NewSessionProps {}

const NewSession: FC<NewSessionProps> = ({}) => {
  const restartSessionAlert = alerts.restartSession;
  const title = restartSessionAlert.title;
  const description = restartSessionAlert.description;

  return (
    <Alert title={title} description={description}>
      <Button variant="ghost">
        <Icons.newSession />
      </Button>
    </Alert>
  );
};

export default NewSession;
