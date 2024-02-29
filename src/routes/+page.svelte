<script context="module">
  let query = "";
  let info = "";
  let Loading = false;

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
  Describe the type of anime you're in the mood for, and any specific elements you enjoy.
  <input type="text" bind:value={query}>
  <button class="Bind-Query" on:click={onclick} disabled={Loading}>Search</button>
</p>

<!-- Add a div to display the info -->
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
</style>
