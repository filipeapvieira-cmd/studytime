import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

export const SetupInstructions = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="setup-instructions" className="border-zinc-800">
        <AccordionTrigger className="text-zinc-100 hover:text-zinc-100 hover:no-underline">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-4 w-4" />
            <span>How to set up Cloudinary</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-zinc-400">
          <div className="space-y-4 pt-2">
            <p>
              To use image upload features, you&apos;ll need to configure your
              Cloudinary credentials. Follow these steps:
            </p>
            <ol className="list-decimal space-y-2 pl-4">
              <li>
                Sign up for a free account at{" "}
                <a
                  href="https://cloudinary.com/users/register/free"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Cloudinary
                </a>
              </li>
              <li>After signing in, go to your Dashboard</li>
              <li>Copy your Cloud Name, API Key, and API Secret</li>
              <li>Paste these details in the form below</li>
            </ol>
            <p className="text-sm text-zinc-500">
              Note: Your credentials are securely stored and only used for image
              upload functionality.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
