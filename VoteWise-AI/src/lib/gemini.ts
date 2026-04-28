import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your .env has VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

const systemPrompt = `You are VoteWise AI.
Explain election procedures simply.
Use numbered steps.
Stay neutral.
Only voter education.
No political opinions.`;

const faqData = [
  { keywords: ["who", "can vote", "eligible", "age"], answer: "Indian citizens aged 18 or above and registered as voters can vote." },
  { keywords: ["register", "enroll", "apply", "form"], answer: "Apply through voter registration portal and submit required details." },
  { keywords: ["epic", "card", "voter id"], answer: "EPIC is your voter ID card." },
  { keywords: ["evm", "machine", "cast"], answer: "EVM is the electronic machine used to cast votes." },
  { keywords: ["where", "find", "booth", "polling", "location"], answer: "Use the booth locator or election authority resources." },
  { keywords: ["id", "document", "carry", "proof"], answer: "Voter ID or other accepted identification documents." },
  { keywords: ["first", "first-time", "new"], answer: "Yes, if registered." },
  { keywords: ["nri", "overseas", "abroad"], answer: "Follow applicable voter rules for NRI voters." },
  { keywords: ["happen", "day", "process", "voting day"], answer: "Visit booth, verify identity and cast your vote." },
  { keywords: ["result", "declare", "win"], answer: "Votes are counted and results are officially announced." }
];

export const getGeminiResponse = async (prompt: string, language: string = 'English') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const lowerPrompt = prompt.toLowerCase();
  
  // Find the best matching FAQ
  for (const faq of faqData) {
    if (faq.keywords.some(kw => lowerPrompt.includes(kw))) {
      return faq.answer;
    }
  }

  // Fallback if no keywords match
  return "I am a Demo AI FAQ Assistant. Please ask about voter registration, EVMs, polling booths, or election day procedures.";
};

export const analyzeEligibility = async (situation: string, language: string = 'English') => {
  const ageMatch = situation.match(/\d+/);
  if (ageMatch && parseInt(ageMatch[0]) >= 18) {
    return { status: 'eligible', explanation: 'You are 18 or older. If you are an Indian citizen and registered, you are eligible to vote.' };
  } else if (ageMatch) {
    return { status: 'ineligible', explanation: 'You must be at least 18 years old to vote.' };
  }
  return { status: 'invalid', explanation: 'Please enter your age as a number.' };
};
