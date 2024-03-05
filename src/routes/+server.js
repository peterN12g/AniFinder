//API call for Anime Information
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "$env/static/private";
import { IMAGE_API_KEY } from "$env/static/private";
import { getJson } from "serpapi";
import { resolve } from "path";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET({url}) {
  const prompt = url.searchParams.get("prompt");
  const genre = url.searchParams.get("genre")
  const text = await run(prompt,genre);

  const imageResult = await getImage("narutoPoster");
  console.log(imageResult);
  return new Response(text);
}

async function run(query,genre) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
  const prompt = "Suggest ONLY one " + genre + " anime with a title and ONLY 3 descriptive short bullet points in a vertical list format " + query;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

// API call for Anime Image
async function getImage(query) {
  return new Promise((resolve,reject) => {
    getJson(
  {
  engine: "google_images",
  q: query,
  api_key: IMAGE_API_KEY,
  ijin: 0,
},
(json) => {
  const firstImage = json?.images_results?.[0];
  resolve(firstImage);
});
});
}
