<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import './styles.css';
  let formattedInfo = '';
  let imgLink = '';
  let imgAlt = 'Anime poster';

  function formatApiResponse(info) {
    let formattedOutput = '';
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
        formattedOutput += '</ul>\n';
      }
    }
    return formattedOutput.trim();
  }

  onMount(() => {
    const responseData = JSON.parse(sessionStorage.getItem('animeResponse') || '{}');
    if (responseData.text) {
      formattedInfo = formatApiResponse(responseData.text);
      imgLink = responseData.imgLink || '';
      imgAlt = responseData.title || 'Anime poster';
    } else {
      goto('/');
    }
  });
</script>

<div id="results-container">
  <h1>Anime Search Results</h1>
  {#if formattedInfo}
    <div id="info-display">
      {@html formattedInfo}
    </div>
  {:else}
    <p>No results available.</p>
  {/if}
  <div class="poster">
    {#if imgLink}
        <img id="img-display" src={imgLink} alt={imgAlt} loading="lazy" />
    {/if}
    <button class="query" on:click={() => goto('/')}>Back to Search</button>
  </div>
</div>