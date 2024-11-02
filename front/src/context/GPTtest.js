require('dotenv').config();
const OpenAI = require('openai');


const openai = new OpenAI({
    apiKey: '', // defaults to process.env["OPENAI_API_KEY"]
});
  
async function main() {
	const completion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: '鬼滅の刃の煉獄さんが死んだ際にかけるお別れの言葉を考えてください。' }],
		model: 'gpt-3.5-turbo',
        max_tokens: 100,
	});
	
	console.log(completion.choices[0].message.content);
}
  
main();