<script context="module">
  let query = "";
  let info = "";
  let Loading = false;
  let genre = "";
  let title = "";

  async function onclick() {
    try {
        Loading = true;
        showLoadingSpinner();

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
        Loading = false;
        hideLoadingSpinner();
    }
}

function showLoadingSpinner() {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) {
        loadingDiv.style.display = "inline-block";
    }
}

function hideLoadingSpinner() {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) {
        loadingDiv.style.display = "none";
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

<h1>Welcome to AnimeFinder</h1>
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
  <p>Enter a Reference Anime(ex: "Like Naruto")</p>
  <input type="text" bind:value={query}>
  <button class="Bind-Query" on:click={onclick} disabled={Loading}>
    {#if Loading}
      <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    {:else}
      Search
    {/if}
  </button>
  <img id="img-display" alt="animePic">
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
    background-color: darkslategrey;
    margin-right: auto;
    margin-top: 5px;
    width: 15%;
    color: white;
    font-size: 1em;
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
  width: 20%;
  height: 20%;
  margin-left: auto;
  margin-right: auto;
 }

/* Loading Spinner CSS */
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>