import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY, CX, GOOGLE_API_KEY } from "$env/static/private";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET({ url }) {
  try {
    const prompt = url.searchParams.get("prompt");
    const genre = url.searchParams.get("genre");

    console.log("Request received:", { prompt, genre });

    if (!prompt || !genre) {
      return new Response(
        JSON.stringify({ error: "Prompt and genre are required" }),
        { status: 400 }
      );
    }

    const text = await run(prompt, genre);
    console.log("Generated text:", text);

    const titleMatch = text.match(/- (.*?)(?:\n|$)/);
    const title = titleMatch ? `${titleMatch[1].trim()} poster` : null;

    if (!title) {
      throw new Error("Could not extract title from response");
    }

    const imgLink = await getImageTest(title);
    console.log("Image link:", imgLink);

    const responseInfo = {
      text: text,
      imgLink: imgLink
    };

    return new Response(JSON.stringify(responseInfo), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Server error:", e); 
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

async function run(query, genre) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
  const prompt = `Suggest ONLY one ${genre} ANIME show similar to "${query}" with a title and exactly 3 descriptive short bullet points in a vertical list format. The last bullet point must be the IMDb star rating. Format as plain text with "- " before each bullet point.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

async function getImageTest(title) {
  const apiKey = GOOGLE_API_KEY;
  const cx = CX;
  const params = new URLSearchParams({
    key: apiKey,
    cx: cx,
    q: title,
    searchType: "image",
    imgType: "photo",
    siteSearch: "http://www.kylelambert.com OR https://lookaside.instagram.com OR https://www.reddit.com",
    siteSearchFilter: "e",
  });

  const url = "https://www.googleapis.com/customsearch/v1?" + params.toString();
  const result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Image search failed with status: ${result.status}`);
  }

  const json = await result.json();
  if (!json.items || !json.items[0]) {
    throw new Error("No image results found");
  }

  return json.items[0].link;
}