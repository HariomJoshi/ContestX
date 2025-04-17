import { error } from "console";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources.mjs";

// Define the Blog interface
interface BlogContent {
  section: string;
  text: string;
  subsections?: BlogContent[];
}

interface Blog {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  content: BlogContent[];
}

export const generateBlog = async (topic: string): Promise<Blog> => {
  const prompt = `Generate a blog of 1000-1500 words about "${topic}" in JSON format with the following structure:
    {
      "title": "string",
      "description": "string",
      "date": "string",
      "imageUrl": "string",
      "content": [
        {
          "section": "string",
          "text": "string",
          "code?": "string",
          "language?": "string",
          "subsections": [
            {
              "subsection": "string",
              "text": "string",
            }
          ]
        }
      ]
    }
    
    Ensure that:
    1. The content is well-structured with main sections and relevant subsections
    2. Each section and subsection has a clear title and descriptive text
    3. The output is valid JSON
    4. The content is informative and engaging`;

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

    // Remove markdown code fences if present
    if (content.startsWith("```json")) {
      content = content.slice(7, content.lastIndexOf("```")).trim();
    } else if (content.startsWith("```")) {
      content = content.slice(3, content.lastIndexOf("```")).trim();
    }

    const blog = JSON.parse(content) as Blog;
    return blog;
  } catch (error) {
    console.log("Some error occurred at the backend " + error);
    throw error;
  }
};
