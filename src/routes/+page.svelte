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

<h1>Welcome to AnimeFinder</h1>
<div id="background-container">
  <p class="Shows">Select the Genre</p>
  <form class="genreType">
    <label for="showGenre">Choose:</label>
    <select bind:value={genre} name="genre" id="showGenre">
      <option value="Action">Action</option>
      <option value="Adventure">Adventure</option>
      <option value="Comedy">Comedy</option>
      <option value="Fantasy">Fantasy</option>
      <option value="Horror">Horror</option>
      <option value="Mystery">Mystery</option>
      <option value="Psychological">Psychological</option>
      <option value="Romance">Romance</option>
    </select>
  </form>
  <div class="input">
    <label for="query">Enter a Reference Anime (e.g., "Naruto"):</label>
    <input type="text" id="query" bind:value={query} />
  </div>
    <button id="Bind-Query" class="Bind-Query" on:click={onclick} disabled={Loading || !query.trim()}>Search</button>
  {#if Loading}
    <div class="loader-overlay">
      <span class="loader"></span>
    </div>
  {/if}
</div>