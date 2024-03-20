//API call for Anime Information
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY, CX, GOOGLE_API_KEY } from "$env/static/private";
// import { GOOGLE_API_KEY } from "$env/static/private"
// import { customsearch_v1 } from 'googleapis';

const genAI = new GoogleGenerativeAI(API_KEY);

export async function GET({url}) {
  try{
  const prompt = url.searchParams.get("prompt");
  const genre = url.searchParams.get("genre")
  const text = await run(prompt,genre);
  const titleMatch = text.match(/- (.*?)(?:\n|$)/);
  const title = titleMatch ? (titleMatch[1].trim() + " poster") : null;
   const imgLink = await getImageTest(title);
   const responseInfo = {
    text: text,
    imgLink: imgLink
   };
  //  logger.info("Successful API Call", JSON.stringify(responseInfo));
  return new Response(JSON.stringify(responseInfo));
  } catch (e) {
    console.log(e)
    return new Response(e.toString(), { status: 500 });
  }
}


async function run(query,genre) { 
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro-001" });
  const prompt = "Suggest ONLY one " + genre + " ANIME show with a title and ONLY 3 descriptive short bullet points in a vertical list format WITH the LAST bullet point being the IMDB star rating, like \"" + query + "\"";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

// API call for Anime Image

// async function getImage(title) {
//   try{
//   const search = new customsearch_v1.Customsearch()
//   const result = await search.cse.list({
//     cx: "f5a3ae6b7bd4f4c69",
//     key: GOOGLE_API_KEY,
//     q: title,
//     searchType: "image",
//     imgType: "photo",
//     siteSearch: "http://www.kylelambert.com OR https://lookaside.instagram.com",
//     siteSearchFilter: "e",
//   });
//   let link = (result.data.items[0].link)
//   return link;
// } catch(error) {
//   console.error("getImage error")
//   throw error;
//   // logger.error("API Image Call Error", error.message)
// }}

async function getImageTest(title){
  const apiKey = GOOGLE_API_KEY;
  const cx = CX;
  const query = title;
  const searchType = 'image';

  // const url = 'https://www.googleapis.com/customsearch/v1?key='+apiKey+'&cx='+cx+':omuauf_lfve&q='+query+'&searchType=image&imgType=photo&siteSearch=http://www.kylelambert.com OR https://lookaside.instagram.com&siteSearchFilter=e';
  const params = new URLSearchParams({
    key: apiKey,
    cx: cx,
    q: title,
    searchType: "image",
    imgType: "photo",
    siteSearch: "http://www.kylelambert.com OR https://lookaside.instagram.com",
    siteSearchFilter: "e",
  });

  let url = "https://www.googleapis.com/customsearch/v1?" + params.toString();

  const result = await fetch(url);
  const json = await result.json();
  const linkTest = json.items[0].link;
  return linkTest;
}