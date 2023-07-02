import { FC } from "react";

interface HighlightProps {
  text: string;
  searchInput: string;
}

const Highlight: FC<HighlightProps> = ({ text, searchInput }) => {
  if (!searchInput) {
    return text;
  }

  // Split the text into parts around the searchInput string
  // gi flags are used to perform a global (search for all matches) and case-insensitive search.
  const parts = text.split(new RegExp(`(${searchInput})`, "gi"));

  // Join the parts back together, adding a span around the searchInput string
  return parts.map((part, i) =>
    part.toLowerCase() === searchInput.toLowerCase() ? (
      <span key={i} className="bg-primary-foreground text-primary">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default Highlight;
