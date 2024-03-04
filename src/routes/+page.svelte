<script context="module">
  import { HarmBlockThreshold } from "@google/generative-ai";

  let query = "";
  let info = "";
  let Loading = false;
  let genre = "";
  let number = "";

  async function onclick() {
    Loading = true;
    const resp = await fetch("/?" + new URLSearchParams({"prompt": query, "genre": genre}));
    const text = await resp.text();
    info = text;

    const formattedInfo = formatApiResponse(info);
    updateInfoOnPage(formattedInfo);
    Loading = false; 
  }

  function updateInfoOnPage(formattedInfo) {
    const infoElement = document.getElementById("info-display");
    if (infoElement) {
      infoElement.innerHTML = formattedInfo;
    }
  }

  function formatApiResponse(info) {
  let formattedOutput = "";
  const lines = info.split('\n');

  if (lines.length > 0) {
    const title = lines[0].replace(/^\*\s*/, '').trim();
    formattedOutput += `<strong>${title}</strong>\n`;

    if (lines.length > 1) {
      formattedOutput += "<ul style='list-style-type: none;'>\n"; // Add this line
      for (let i = 1; i < lines.length; i++) {
        const detail = lines[i].replace(/^\s*\*\s*/, '').trim();
        if (detail) {
          formattedOutput += `<li>${detail}</li>\n`;
        }
      }
      formattedOutput += "</ul>\n";
    }
  }
  return formattedOutput.trim();
}

function handleSelectChange(event) {
    const selectedValue = event.target.value;
    number = selectedValue;
  }
  
</script>

<h1>Welcome to AnimeFinder</h1>
<p>
  <p class="Shows">Select the Genre</p>
  <form class="showNumber">
    <label for="genre">Choose:</label>
    <select bind:value={genre} on:change={handleSelectChange} name="genre" id="showGenre">
      <option value="Action">Action</option>
      <option value="Adventure">Adventure</option>
      <option value="Comedy">Comedy</option>
      <option value="Fantasy">Fantasy</option>
      <option value="Horror">Horror</option>
      <option value="Mystery">Mystery</option>
      <option value="Psycological">Psycological</option>
      <option value="Romance">Romance</option>
    </select>
  </form>
  <p>Enter a Reference Anime(ex: "Like Naruto")</p>
  <input type="text" bind:value={query}>
  <button class="Bind-Query" on:click={onclick} disabled={Loading}>Search</button>

<div id="info-display"></div>

<style>
  h1 {
    text-align: center;
    background-color: steelblue;
    color: Orange;
  }

  p {
    font-size: 1.1em;
    text-align: left; 
  }

  button.Bind-Query {
    margin-right: auto;
    display: flex;
    margin-top: 5px;
  }

  input {
    display: flex;
    background-color: dimgrey;
    margin-right: auto;
    margin-top: 5px;
    width: 15%;
    color: white;
    font-size: 1em;
  }
  
  form{
    text-align: center;
    background-color: dimgrey;
    width: 15%;
  }

  p.Shows{
    text-align: left;
  }
 
 .showNumber{
  margin-right: auto;
 }

 div#info-display {
    text-align: center;
    margin: 10px auto; 
    width: 100%;
 }

</style>
