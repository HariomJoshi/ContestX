import { error } from "console";
import OpenAI from "openai/index.mjs";

interface Blog {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  content: string; // Markdown content
}

export const generateBlog = async (topic: string): Promise<Blog> => {
  const prompt = `Generate a blog of 1000-1500 words about "${topic}" in Markdown format. The blog should have:
    1. A clear title
    2. A brief description
    3. Well-structured sections with headings (## for main sections, ### for subsections)
    4. Code blocks where relevant (using \`\`\`language syntax)
    5. Proper formatting for lists, quotes, and other markdown elements
    6. The content should be informative and engaging`;

  const apiKey = process.env.DEEPSEEK_API_KEY_FREE;
  if (!apiKey) {
    throw new Error("Missing DeepseekAI API Key");
  }
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
  });

  try {
    const result = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek/deepseek-chat-v3-0324:free",
    });

    let content = result.choices[0].message.content?.trim();
    if (!content) {
      throw new Error("Null content received");
    }

    // Extract title and description from the first few lines
    const lines = content.split("\n");
    const title = lines[0].replace("# ", "");
    const description = lines[2] || ""; // Assuming description is on the third line

    return {
      title,
      description,
      date: new Date().toISOString(),
      imageUrl: "", // You can add image generation logic here if needed
      content: lines.slice(3).join("\n"), // Skip title and description
    };
  } catch (error) {
    console.log("Some error occurred at the backend " + error);
    throw error;
  }
};
