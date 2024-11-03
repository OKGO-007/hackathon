import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // ブラウザでの使用を許可
});

export const openAiRequest = async (title: string, characterName: string) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${title}の${characterName}が死んでしまった時に送るお別れの言葉を考えてください。`,
        },
      ],
      max_tokens: 100,
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI APIエラー:", error);
    throw new Error("APIリクエストに失敗しました。");
  }
};




// export const openAiRequest = async (title, character_name) => {
//   const response = await fetch("https://<YOUR_PROJECT_ID>.cloudfunctions.net/generateMessage", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ title, character_name }),
//   });
  
//   const data = await response.json();
//   return data.message;
// };
