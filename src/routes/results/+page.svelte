<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import './styles.css';

  let formattedInfo = '';
  let imgLink = '';
  let imgAlt = 'Anime poster';
  let saved = false;
  let token = localStorage.getItem('token');

  function formatApiResponse(info) {
    let formattedOutput = '';
    const lines = info.split('\n');

    if (lines.length > 0) {
      const title = lines[0].replace(/^\*\s*/, '').trim();
      formattedOutput += `<h2 class="result-title">${title}</h2>\n`;

      if (lines.length > 1) {
        formattedOutput += `<ul class="result-list">\n`;
        for (let i = 1; i < lines.length; i++) {
          const detail = lines[i].replace(/^\s*\*\s*/, '').trim();
          if (detail) {
            formattedOutput += `<li>${detail}</li>\n`;
          }
        }
        formattedOutput += `</ul>\n`;
      }
    }
    return formattedOutput.trim();
  }

  async function saveSearch() {
    const stored = JSON.parse(sessionStorage.getItem('animeResponse'));
    const genre = sessionStorage.getItem('genre');
    const prompt = sessionStorage.getItem('prompt');

    const res = await fetch('/api/searches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt,
        genre,
        result: stored.text
      })
    });

    if (res.ok) saved = true;
    console.log('Sending search with:', {
  token,
  prompt,
  genre,
  result: stored?.text
});

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

<main class="results-container">
  <h1 class="results-header">Your Anime Results</h1>

  <div class="results-grid">
    {#if imgLink}
      <img id="img-display" class="anime-poster" src={imgLink} alt={imgAlt} loading="lazy" />
    {/if}

    {#if formattedInfo}
      <div id="info-display" class="info-card" transition:fade>
        {@html formattedInfo}
      </div>
    {:else}
      <p class="empty-message">No results available.</p>
    {/if}
  </div>

  <div class="results-actions">
    <button class="back-button" on:click={() => goto('/')}>🔙 Back to Search</button>
    {#if token}
      <button on:click={saveSearch} disabled={saved} class="save-button">
        {saved ? '✅ Saved' : '💾 Save Search'}
      </button>
    {/if}
  </div>
</main>
