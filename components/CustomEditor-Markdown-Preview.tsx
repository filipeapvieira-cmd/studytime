import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";

import Image from "next/image";

interface CustomEditorMarkdownPreviewProps {
  handleCreateMarkup: { __html: string | TrustedHTML };
  test: any;
}

const isMarkdownUnchanged = (
  prevProps: CustomEditorMarkdownPreviewProps,
  nextProps: CustomEditorMarkdownPreviewProps
) => {
  return (
    prevProps.handleCreateMarkup.__html === nextProps.handleCreateMarkup.__html
  );
};

const CustomEditorMarkdownPreview: FC<CustomEditorMarkdownPreviewProps> = memo(
  ({ handleCreateMarkup, test }) => {
    return (
      <div className="flex-1">
        <h1 className="text-foreground bg-background text-3xl text-center rounded-md p-2">
          Markdown Preview
        </h1>
        {/* <div id="preview" dangerouslySetInnerHTML={handleCreateMarkup} /> */}

        <ReactMarkdown
          components={{
            img: function ({ ...props }) {
              const substrings = props.alt?.split("{{");
              const alt = substrings[0].trim();

              const width = substrings[1]
                ? substrings[1].match(/(?<=w:\s?)\d+/g)[0]
                : 800;
              const height = substrings[1]
                ? substrings[1].match(/(?<=h:\s?)\d+/g)[0]
                : 400;

              return (
                <Image
                  src={props.src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              );
            },
          }}
        >
          {test}
        </ReactMarkdown>
      </div>
    );
  },
  isMarkdownUnchanged
);

CustomEditorMarkdownPreview.displayName = "CustomEditorMarkdownPreview";

export default CustomEditorMarkdownPreview;
