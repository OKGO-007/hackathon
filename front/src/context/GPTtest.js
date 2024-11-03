require('dotenv').config();
//import dotenv from 'dotenv';
//dotenv.config();
const OpenAI = require('openai');


const openai = new OpenAI({
<<<<<<< HEAD
    apiKey: '', // defaults to process.env["REACT_APP_OPENAI_API_KEY"]
=======
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
>>>>>>> 168ab30f14539cb7f8a9f4faeb008528df642fce
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