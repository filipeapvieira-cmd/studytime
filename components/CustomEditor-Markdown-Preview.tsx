import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";

import Image from "next/image";
import Title from "./custom-editor/title";
import EditorContainer from "./custom-editor/container";

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
      <EditorContainer className="flex-1 overflow-y-auto">
        <Title title="Markdown Preview" />
        {/* <div id="preview" dangerouslySetInnerHTML={handleCreateMarkup} /> */}
        <section className="h-[93%] bg-secondary">
          <ReactMarkdown
            // prose classes: https://github.com/tailwindlabs/tailwindcss-typography
            className="prose text-foreground prose-headings:text-foreground prose-a:text-sky-600 prose-code:text-sm prose-code:text-yellow-500 prose-strong:text-foreground prose-strong:font-bold bg-secondary"
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
        </section>
      </EditorContainer>
    );
  },
  isMarkdownUnchanged
);

CustomEditorMarkdownPreview.displayName = "CustomEditorMarkdownPreview";

export default CustomEditorMarkdownPreview;
