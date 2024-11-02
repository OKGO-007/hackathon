require('dotenv').config();
const OpenAI = require('openai');


const openai = new OpenAI({
    apiKey: '', // defaults to process.env["OPENAI_API_KEY"]
});
  
async function main() {
	const completion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: 'あなたの名前は?' }],
		model: 'gpt-3.5-turbo',
	});
	
	console.log(completion.choices[0].message.content);
}
  
main();