<script context="module">
  import { HarmBlockThreshold } from "@google/generative-ai";

  let query = "";
  let info = "";
  let Loading = false;
  let genre = "";
  let number = "";

  async function onclick() {
    Loading = true;
    const resp = await fetch("/?" + new URLSearchParams({"prompt": query}));
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

    // Process the remaining lines as details
    if (lines.length > 1) {
      formattedOutput += "<ul>\n";
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


  
</script>

<h1>Welcome to AnimeFinder</h1>
<p>
  <p class="Shows">Select the Number of Anime to Search</p>
  <form>
    <label class="radio-inline">
      <input type="radio" name="optradio" checked>1 Show
    </label>
    <label class="radio-inline">
      <input type="radio" name="optradio">3 Shows
    </label>
    <label class="radio-inline">
      <input type="radio" name="optradio">5 Shows
    </label>
  </form>
  <input type="text" bind:value={query}>
  <button class="Bind-Query" on:click={onclick} disabled={Loading}>Search</button>

<div id="info-display"></div>

<style>
  h1 {
    text-align: center;
  }

  p {
    text-align: center;
    font-size: 1.1em;
  }

  button.Bind-Query {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    margin-top: 5px;
  }

  input {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    width: 15%;
  }
  
  form{
    text-align: center;
    background-color: white;
    width: 15%;
  }
  .radio-inline {
    display: inline-block;
    margin-right: 10px;
  }
  p.Shows{
    text-align: left;
  }
</style>
