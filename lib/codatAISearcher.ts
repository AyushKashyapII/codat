import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function aiSearch(text:String, query:String) {
  const prompt = "You are a bot which is going to tell me the id of the Text which is closest and most accurately represents the QUery of the text the user is referring to. Make sure you only return me the id of the Text and nothing else, NOTHING. I have to forward and use this Id somewhere else, so you typing any single text other then id will ruin the working somewhere else. Give only 1 id, even if you find multiple piece of text matches the query. If such a scenario appears where no such piece of text is there which is matches with query, return me a simple 0 and i will return there is no such piece of text. Remember, First i will provide Id of the text below it, then the text itself and the Id of second text and then its text and so on. Example - ID: 01\n this is text 1\n\n ID: 02 \n this is text 2. Here is the entire text:\n\n" + text + "\n\nHere is the query:\n\n" + query + "\n\n";
  const completion = await groqClient.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
  });
  return completion.choices[0]?.message?.content;
}