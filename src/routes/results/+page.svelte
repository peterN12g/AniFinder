<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import './styles.css';

  const API_BASE_URL = 'https://api.anifinder.peternguyen.me';

  let formattedInfo = '';
  let imgLink = '';
  let imgAlt = 'Anime poster';
  let saved = false;
  let savedSearches = [];
  let showSavedSearches = false;

  function formatApiResponse(info) {
    let formattedOutput = '';

    if (info.title) {
      formattedOutput += `<h2 class="result-title">${info.title}</h2>\n`;
    }

    if (info.bullets && Array.isArray(info.bullets)) {
      formattedOutput += `<ul class="result-list">\n`;
      for (const detail of info.bullets) {
        const cleaned = detail.replace(/^\*\s*/, '').trim();
        if (cleaned) {
          formattedOutput += `<li>${cleaned}</li>\n`;
        }
      }
      formattedOutput += `</ul>\n`;
    }

    return formattedOutput.trim();
  }

  async function saveSearch(e) {
    e.preventDefault();
    const stored = JSON.parse(sessionStorage.getItem('animeResponse'));
    const genre = sessionStorage.getItem('genre');
    const prompt = sessionStorage.getItem('prompt');

    try {
      const res = await fetch(`${API_BASE_URL}/api/save-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre,
          result: stored   // ✅ send full result
        })
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Search saved successfully:', data);
        saved = true;
        await loadSavedSearches();
      } else {
        console.error('Failed to save search:', res.statusText);
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }

    console.log('Sending search with:', { prompt, genre, result: stored });
  }

  async function loadSavedSearches() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-searches`);

      if (res.ok) {
        const data = await res.json();
        savedSearches = data.searches.map(search => ({
          ...search,
          formattedResult: formatApiResponse({
            title: search.title,
            bullets: search.bullets,
            imgLink: search.imgLink
          })
        }));
      } else {
        console.error('Failed to load saved searches:', res.statusText);
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  }

  async function deleteSearch(searchId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-searches/${searchId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await loadSavedSearches(); // reload after delete
      } else {
        console.error('Failed to delete search:', res.statusText);
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  }


  onMount(() => {
    const responseData = JSON.parse(sessionStorage.getItem('animeResponse') || '{}');
    if (responseData.title || responseData.bullets) {
      formattedInfo = formatApiResponse(responseData);
      imgLink = responseData.imgLink || '';
      imgAlt = responseData.title || 'Anime poster';
    } else {
      goto('/');
    }
    loadSavedSearches();
  });
</script>

<main class="results-container">
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
    <button on:click={saveSearch} disabled={saved} class="save-button">
      {saved ? '✅ Saved' : '💾 Save Search'}
    </button>
    <button on:click={() => (showSavedSearches = !showSavedSearches)} class="toggle-saved-button">
      {showSavedSearches ? '🔼 Hide Saved Searches' : '🔽 Show Saved Searches'}
    </button>
  </div>

  {#if showSavedSearches && savedSearches.length > 0}
    <div class="saved-searches-section" transition:fade>
      <h2 class="saved-searches-title">Saved Searches</h2>
      <div class="saved-searches-grid">
        {#each savedSearches as search}
          <div class="saved-search-card">
            <h3>{search.prompt} ({search.genre})</h3>
            <div class="saved-search-content">
              {@html search.formattedResult}
            </div>
            <button class="delete-button" on:click={() => deleteSearch(search.id)}>
              ❌ Delete
            </button>
          </div>
        {/each}
      </div>
    </div>
  {:else if showSavedSearches && savedSearches.length === 0}
    <p class="empty-message">No saved searches yet.</p>
  {/if}
</main>
