import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const openAiRequest = async (messages: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // string;
    messages: [
      {
        role: "user", // "user" | "assistant" | "system"
        content: messages, // string
      },
    ],
    max_tokens: 100,
  });
  
  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
};