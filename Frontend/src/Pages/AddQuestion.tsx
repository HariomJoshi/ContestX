import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface TestCase {
  input: string;
  output: string;
}

const AddQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", output: "" },
  ]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", output: "" }]);
  };

  const removeTestCase = (index: number) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const updateTestCase = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/questions`,
        {
          title,
          description,
          constraints,
          testCases,
          inputFormat,
          outputFormat,
          tags,
        }
      );

      if (response.status === 201) {
        toast.success("Question added successfully!");
        navigate("/questions");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add question");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter question title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter question description"
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Input Format</label>
              <Textarea
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                placeholder="Enter Input format"
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Textarea
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                placeholder="Enter output format"
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Constraints</label>
              <Textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Enter question constraints (e.g., 1 ≤ n ≤ 10^5)"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Test Cases</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTestCase}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Test Case
                </Button>
              </div>

              {testCases.map((testCase, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">
                      Test Case {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Input</label>
                    <Textarea
                      value={testCase.input}
                      onChange={(e) =>
                        updateTestCase(index, "input", e.target.value)
                      }
                      placeholder="Enter test case input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Output</label>
                    <Textarea
                      value={testCase.output}
                      onChange={(e) =>
                        updateTestCase(index, "output", e.target.value)
                      }
                      placeholder="Enter test case output"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter)"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/questions")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Question</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestion;
