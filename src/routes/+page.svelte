<script>
  import './styles.css';
  import { goto } from '$app/navigation';

  let query = '';
  let Loading = false;
  let genre = '';

  async function onclick() {
    document.getElementById('Bind-Query').disabled = true;
    try {
      Loading = true;
      const resp = await fetch(`/?${new URLSearchParams({ prompt: query, genre })}`);

      if (!resp.ok) {
        throw new Error(`Fetch failed with status: ${resp.status}`);
      }

      const responseInfo = await resp.json();
      const info = responseInfo.text || 'No information available';
      const imgLink = responseInfo.imgLink || '';
      const title = responseInfo.title || 'Anime poster';

      sessionStorage.setItem('animeResponse', JSON.stringify({ text: info, imgLink, title }));
      goto('/results');
    } catch (error) {
      console.error('There was an error', error);
      sessionStorage.setItem('animeResponse', JSON.stringify({ text: 'An error occurred! Please try again.', imgLink: '' }));
      goto('/results');
    } finally {
      document.getElementById('Bind-Query').disabled = false;
      Loading = false;
    }
  }
</script>

<main class="container">
  <h1>AnimeFinder</h1>
  <p class="subtitle">Discover similar anime by genre and example!</p>

  <form class="search-form" on:submit|preventDefault={onclick}>
    <label for="showGenre">Select Genre:</label>
    <select bind:value={genre} id="showGenre" required>
      <option value="" disabled selected>-- Choose Genre --</option>
      <option value="Action">Action</option>
      <option value="Adventure">Adventure</option>
      <option value="Comedy">Comedy</option>
      <option value="Fantasy">Fantasy</option>
      <option value="Horror">Horror</option>
      <option value="Mystery">Mystery</option>
      <option value="Psychological">Psychological</option>
      <option value="Romance">Romance</option>
    </select>

    <label for="query">Reference Anime:</label>
    <input type="text" id="query" placeholder="e.g., Naruto" bind:value={query} required />

    <button id="Bind-Query" class="Bind-Query" type="submit" disabled={Loading || !query.trim()}>
      {#if Loading}
        <span class="spinner"></span>
      {:else}
        🔍 Search
      {/if}
    </button>
  </form>
</main>
