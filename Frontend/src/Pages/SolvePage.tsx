import CodeBlock from "@/components/CodeBlock";

const SolvePage = () => {
  const block = {
    properties: {
      title: "this is code",
    },
  };
  return (
    <div>
      <CodeBlock block={block} />
    </div>
  );
};

export default SolvePage;
