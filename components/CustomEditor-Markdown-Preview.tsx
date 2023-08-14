import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";

import Image from "next/image";

interface CustomEditorMarkdownPreviewProps {
  handleCreateMarkup: string;
}

const isMarkdownUnchanged = (
  prevProps: CustomEditorMarkdownPreviewProps,
  nextProps: CustomEditorMarkdownPreviewProps
) => {
  return prevProps.handleCreateMarkup === nextProps.handleCreateMarkup;
};

const CustomEditorMarkdownPreview: FC<CustomEditorMarkdownPreviewProps> = memo(
  ({ handleCreateMarkup }) => {
    return (
      <div className="flex-1">
        <h1 className="text-foreground bg-background text-3xl text-center rounded-md p-2">
          Markdown Preview
        </h1>
        {/* <div id="preview" dangerouslySetInnerHTML={handleCreateMarkup} /> */}

        <ReactMarkdown
          // maps img element to next.js Image
          // https://www.codeconcisely.com/posts/nextjs-image-in-markdown/
          components={{
            img: function ({ ...props }) {
              const substrings = props.alt?.split("{{");

              const alt = substrings?.[0]?.trim() || "";
              const width =
                Number(substrings?.[1]?.match(/(?<=w:\s?)\d+/g)?.[0]) || 800;
              const height =
                Number(substrings?.[1]?.match(/(?<=h:\s?)\d+/g)?.[0]) || 400;
              const src = props.src || "";

              return (
                <Image src={src} alt={alt} width={width} height={height} />
              );
            },
          }}
        >
          {handleCreateMarkup}
        </ReactMarkdown>
      </div>
    );
  },
  isMarkdownUnchanged
);

CustomEditorMarkdownPreview.displayName = "CustomEditorMarkdownPreview";

export default CustomEditorMarkdownPreview;
