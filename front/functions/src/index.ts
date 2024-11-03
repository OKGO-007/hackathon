import * as functions from "firebase-functions";
import { OpenAI } from "openai";

// OpenAI APIの設定
const openai = new OpenAI({
  apiKey: functions.config().openai.key, // Firebase Functionsの環境変数から取得
});

// リクエストのボディの型定義
interface OpenAiRequestBody {
  title: string;
  characterName: string;
}

// Cloud Functionの定義
export const openAiRequest = functions.https.onRequest(async (request, response) => {
  // リクエストのボディを型定義に基づいて取得
  const { title, characterName } = request.body as OpenAiRequestBody;

  // 入力の検証
  if (!title || !characterName) {
    response.status(400).send("タイトルまたはキャラクター名が未定義です。");
    return;
  }

  try {
    // OpenAI APIへのリクエスト
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Tell me about ${characterName} from ${title}.` }],
    });

    // レスポンスを返す
    response.json(result);
  } catch (error) {
    console.error("OpenAI APIエラー:", error);
    // response.status(500).send(error.message);
  }
});
