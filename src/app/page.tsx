import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import EditorSkeleton from "@/components/skeletons/EditorSkeleton";

export default function Home() {
  return (
    <div className="">
      <Counter />
      <Editor className="mt-5" />
      {/* <EditorSkeleton /> */}
    </div>
  );
}
