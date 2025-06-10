<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import './styles.css';

  let formattedInfo = '';
  let plainTextInfo = '';
  let imgLink = '';
  let imgAlt = 'Anime poster';
  let searchHistory = [];
  let showHistory = false;

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  function getResponseHash(responseData) {
    const dataString = JSON.stringify({
      text: responseData.text || '',
      imgLink: responseData.imgLink || '',
      title: responseData.title || ''
    });
    return hashString(dataString);
  }

  function formatApiResponse(info) {
    let formattedOutput = '';
    let plainOutput = '';
    const lines = info.split('\n');

    if (lines.length > 0) {
      const title = lines[0].replace(/^\*\s*/, '').trim();
      formattedOutput += `<h2 class="result-title">${title}</h2>\n`;
      plainOutput += `${title}\n`;

      if (lines.length > 1) {
        formattedOutput += `<ul class="result-list">\n`;
        for (let i = 1; i < lines.length; i++) {
          const detail = lines[i].replace(/^\s*\*\s*/, '').trim();
          if (detail) {
            formattedOutput += `<li>${detail}</li>\n`;
            plainOutput += `• ${detail}\n`;
          }
        }
        formattedOutput += `</ul>\n`;
      }
    }

    plainTextInfo = plainOutput.trim();
    return formattedOutput.trim();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(plainTextInfo).then(() => {
      alert('Copied to clipboard!');
    });
  }

  function toggleHistory() {
    showHistory = !showHistory;
  }

  function clearHistory() {
    sessionStorage.removeItem('animeSearchHistory');
    searchHistory = [];
    showHistory = false;
  }

  onMount(() => {
    const responseData = JSON.parse(sessionStorage.getItem('animeResponse') || '{}');
    if (responseData.text) {
      formattedInfo = formatApiResponse(responseData.text);
      imgLink = responseData.imgLink || '';
      imgAlt = responseData.title || 'Anime poster';

      const history = JSON.parse(sessionStorage.getItem('animeSearchHistory') || '[]');
      const responseHash = getResponseHash(responseData);
      const isDuplicate = history.some(item => getResponseHash(item) === responseHash);
      if (!isDuplicate) {
        history.push(responseData);
        sessionStorage.setItem('animeSearchHistory', JSON.stringify(history));
      }
    } else {
      goto('/');
    }

    searchHistory = JSON.parse(sessionStorage.getItem('animeSearchHistory') || '[]');
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

  <button class="copy-button" on:click={copyToClipboard}>📋 Copy Info</button>
  <button class="history-button" on:click={toggleHistory}>
    {showHistory ? 'Hide History' : '📜 Display History'}
  </button>
  <button class="back-button" on:click={() => goto('/')}>🔙 Back to Search</button>

  {#if showHistory && searchHistory.length > 0}
    <div class="history-container" transition:fade>
      <div class="history-header-container">
        <h2 class="history-header">Search History</h2>
        <button class="history-button" on:click={clearHistory}>🗑️ Clear History</button>
      </div>
      {#each searchHistory as historyItem, index}
        <div class="history-item">
          <h3 class="result-title">{historyItem.title || 'Anime ' + (index + 1)}</h3>
          {#if historyItem.imgLink}
            <img class="history-poster" src={historyItem.imgLink} alt={historyItem.title || 'Anime poster'} loading="lazy" />
          {/if}
          <div class="history-info" transition:fade>
            {@html formatApiResponse(historyItem.text)}
          </div>
        </div>
      {/each}
    </div>
  {:else if showHistory}
    <p class="empty-message">No search history available.</p>
  {/if}
</main>