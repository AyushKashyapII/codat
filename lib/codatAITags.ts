import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function aiTags(code : string, language : string) {
    const prompt = "This is a " + language + " code snippet" + ".\n\n" + code + "\n\n" + 
    "I want you to generate tags for this code snippet. Please select from the list of pre-existing tags I'll provide. If you think the provided tags are not enough, you can add your own relevant tags.\n\n" +
    "Your output must be ONLY the tags as array elements without any surrounding square brackets, quotes, or additional text. For example: linked list, memory allocation, structure\n\n" + 
    "I will process your response, so do not format it as JSON or add any explanations. Just provide a comma-separated list of tags and nothing else.\n\n" +
    "Here are the pre-existing tags to choose from: ['array','string','linked list','tree','graph','dynamic programming','greedy','backtracking','recursion','hashing','sorting','searching','bit manipulation','stack','queue','heap','priority queue','deque','set','map','multiset','multimap','vector','list','forward list','array','pair','tuple','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue','stack','deque','set','map','unordered set','unordered map','unordered multiset','unordered multimap','bitset','valarray','queue','priority queue'";
    const completion = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
    });
    return completion.choices[0]?.message?.content;
    }