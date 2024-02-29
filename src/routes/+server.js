import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "$env/static/private";

let query = "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET({url}) {
  const prompt = url.searchParams.get("prompt");
  const text = await run(prompt);
  return new Response(text);
}

async function run(query) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
  const prompt = "Suggest an anime with paragraph formatted description" + query

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}