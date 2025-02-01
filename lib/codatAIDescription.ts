import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function aiDesc(code : string, language : string, userName: string) {
  const prompt = "This is a " + language + " code snippet" + ".\n\n" + code + "\n\n I want you to describe this code snippet in a few sentences. Give me a brief description of the code, and make sure it is not more than 100-200 words. I only want concise words that describe the code. Please do not include any code in your description. \n\n";
  const completion = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });
  return completion.choices[0]?.message?.content;
}