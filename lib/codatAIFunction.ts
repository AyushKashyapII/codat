import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function aiFunc(code : string, language : string, userName: string) {
  const prompt = "This is a " + language + " code snippet" + ".\n\n" + code + "\n\n I want you to write this code in forms of functions, like if my code is on how to add two numbers, you can create a function named 'codatAddTwoNumbers', and convert entire code into functions which is easy to understand and implement in any form of project. If there needs to be a module that is to be downloaded, first mention that along with how to download it. Then the code converted into function, and then how to return the functions answer in the main function of the code. Please make sure you write it in a way that is easy to understand. Also make sure there is no other text in your code, and just the code is there, if you need to write any form of code write it in comments but inside the code only.  \n\n";
  const completion = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });
  return completion.choices[0]?.message?.content;
}