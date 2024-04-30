<script context="module">
  let query = "";
  let info = "";
  let Loading = false
  let genre = "";
  let title = "";
  
  async function onclick() {
    document.getElementById('Bind-Query').disabled = true;
    try {
        Loading = true;

        const resp = await fetch("/?" + new URLSearchParams({"prompt": query, "genre": genre}));

        if (!resp.ok) {
            throw new Error(`Fetch failed with status: ${resp.status}`);
        }

        const responseInfo = await resp.json();
        const info = responseInfo.text;
        const imgLink = responseInfo.imgLink;
        displayImage(imgLink);
        const formattedInfo = formatApiResponse(info);
        updateInfoOnPage(formattedInfo);
    } catch (error) {
        console.error("There was an error", error);
        responseInfo = { text: "An error has occurred! Please try again." };
    } finally {
        document.getElementById('Bind-Query').disabled = false;
        Loading = false;
    }
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
        formattedOutput += "<ul style='list-style-type: none;'>\n";
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
    genre = selectedValue;
  }

  function displayImage(imgLink) {
    const imgElement = document.getElementById("img-display");

    if (imgElement) {
      imgElement.src = imgLink;
      imgElement.style.display = "block";
    }
  }
</script>

<div id="background-container">
  <h1>Welcome to AnimeFinder</h1>
<!-- svelte-ignore a11y-img-redundant-alt -->
<p>
  <p class="Shows">Select the Genre</p>
  <form class="genreType">
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
  <p>Enter a Reference Anime(ex: "Naruto")</p>
  <input type="text" bind:value={query}>
  <button id="Bind-Query" class="Bind-Query" on:click={onclick} disabled={Loading}>Search</button>
  <img id="img-display" alt="animePic">
  <div id="info-display"></div>
</div>


<style>
  h1 {
    text-align: center;
    color: #bbdbdf;
    background-color: black;
    height: 100%;
    margin: 0;
    padding: 0;
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
    background-color: darkslategrey;
    margin-right: auto;
    margin-top: 5px;
    width: 15%;
    color: white;
    font-size: 1em;
    opacity: 100%;
  }
  
  form{
    text-align: center;
    background-color:lapt dimgrey;
    width: 15%;
  }

  p.Shows{
    text-align: left;
  }
 
 .genreType{
  margin-right: auto;
  position: relative;
 }

 div#info-display {
    text-align: center;
    margin: 10px auto; 
    width: 100%;
    font-size: 2em;
    color: #bbdbdf;
 }

 form.genreType select {
  color: white;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
  cursor: pointer;
  user-select: none;
  background-color: darkslategrey;
 }

 form.genreType option {
  background-color: darkslategrey;
  color: white;
 }

 img#img-display{
  width: 30%;
  height: 30%;
  margin-left: auto;
  margin-right: auto;
 }

</style>