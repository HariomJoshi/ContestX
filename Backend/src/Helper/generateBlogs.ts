import { error } from "console";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources.mjs";

// Define the Blog interface
export interface Blog {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export const generateBlogs = async (topic: string): Promise<any> => {
  // Construct the prompt to generate a blog in JSON format
  const prompt = `Generate a blog about "${topic}" in JSON format with the following keys:
    - title (string)
    - description (string)
    - date (string)
    - imageUrl (string)
    
  Ensure that the output is valid JSON.`;

  // Get your OpenAI API key from environment variables (or another secure source)
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OpenAI API Key");
  }
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [{ role: "user", content: "write a haiku about ai" }],
  });

  completion
    .then((result) => {
      console.log(result.choices[0].message);

      try {
        if (result.choices[0].message.content != null) {
          const blog: Blog = JSON.parse(result.choices[0].message.content);
          return blog;
        } else {
          throw new Error("Null content recieved");
        }
      } catch (error) {
        throw new Error("Failed to parse generated blog JSON");
      }
    })
    .catch((err) => {
      console.log("Some error occured at the backend " + err);
    });
};
