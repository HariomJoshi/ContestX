import { useRef, useState } from "react";

// Custom CodeEditor Component
type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  editorTheme: "light" | "dark";
};
const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  editorTheme,
}) => {
  const [maximized, setMaximized] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Handle Tab key to insert 4 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue =
        value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);
      // Set the cursor after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Calculate number of lines for the gutter
  const lines = value.split("\n").length || 1;

  return (
    <div
      className={`relative border rounded-md ${
        maximized ? "fixed top-0 left-0 w-full h-full z-50 p-4 bg-gray-900" : ""
      }`}
    >
      <div className="flex">
        {/* Line numbers gutter */}
        <div
          className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-right pr-2 select-none"
          style={{ minWidth: "40px" }}
        >
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Text area editor */}
        <textarea
          ref={textAreaRef}
          className={`flex-1 p-2 outline-none resize-none font-mono ${
            editorTheme === "dark"
              ? "bg-gray-900 text-gray-100 border-gray-700"
              : "bg-white text-gray-900 border-gray-300"
          }`}
          style={{ minHeight: "20rem" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {/* Maximize / Restore button */}
      <button
        onClick={() => setMaximized((prev) => !prev)}
        className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded"
      >
        {maximized ? "Restore" : "Maximize"}
      </button>
    </div>
  );
};

export default CodeEditor;
