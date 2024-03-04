import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "$env/static/private";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET({url}) {
  const prompt = url.searchParams.get("prompt");
  const genre = url.searchParams.get("genre")
  const text = await run(prompt,genre);
  return new Response(text);
}

async function run(query,genre) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
  const prompt = "Suggest ONLY one " + genre + " anime with a title and ONLY 3 descriptive short bullet points in a vertical list format " + query;
  console.log("Before:",genre);

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

