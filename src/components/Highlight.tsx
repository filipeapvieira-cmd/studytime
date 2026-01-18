import type { FC } from "react";

interface HighlightProps {
  text: string;
  searchInput: string;
}

const Highlight: FC<HighlightProps> = ({ text, searchInput }) => {
  if (!searchInput) {
    return <p className="truncate">{text}</p>;
  }

  // Split the text into parts around the searchInput string
  // gi flags are used to perform a global (search for all matches) and case-insensitive search.
  const parts = text.split(new RegExp(`(${searchInput})`, "gi"));

  // Join the parts back together, adding a span around the searchInput string
  return (
    <p className="truncate">
      {parts.map((part, i) =>
        part.toLowerCase() === searchInput.toLowerCase() ? (
          /*className="bg-primary-foreground text-primary" */
          <span key={i} className="bg-yellow-200 text-black">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
};

export default Highlight;
