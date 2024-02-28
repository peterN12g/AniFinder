const key = process.env.API_KEY;
console.log(key)

import { GoogleGenerativeAI } from "@google/generative-ai";

let query = "";
const API_KEY = process.env.API;
const genAI = new GoogleGenerativeAI(API_KEY);

async function run(query) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });

  const prompt = "Suggest an anime with paragraph formatted description" + query

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  console.log(text);
}