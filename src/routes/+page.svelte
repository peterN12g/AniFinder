<script>
  import './styles.css';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let query = '', genre = '';
  let Loading = false;
  let username = '', password = '', displayName = '', token = '', authError = '';
  let isRegister = false;

  onMount(() => {
    token = localStorage.getItem('token') || '';
    displayName = localStorage.getItem('displayName') || '';
  });

  async function handleAuth() {
    authError = '';
    Loading = true;

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isRegister ? 'register' : 'login',
          username,
          password,
          displayName
      })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.message);

    if(isRegister) {
      isRegister = false;
      authError = 'Successfully Registered! Please Log In.';
    } else {
      token = data.token;
      displayName = data.displayName;
      localStorage.setItem('token', token);
      localStorage.setItem('displayName', displayName);
    }
  } catch(err) {
    authError = err.message;
  } finally {
    Loading = false;
  }
}

  function handleLogout() {
    token = '';
    displayName = '';
    username = '';
    password = '';
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    authError = 'Successfully logged out';
  }

  async function onclick() {
    if(!token) {
      authError = 'Please log in to search.';
      return;
    }
    document.getElementById('Bind-Query').disabled = true;
    try {
      Loading = true;
      const resp = await fetch(`/api/search?${new URLSearchParams({ prompt: query, genre })}`);

      if (!resp.ok) {
        throw new Error(`Fetch failed with status: ${resp.status}`);
      }

      const responseInfo = await resp.json();
      const info = responseInfo.text || 'No information available';
      const imgLink = responseInfo.imgLink || '';
      const title = responseInfo.title || 'Anime poster';

      sessionStorage.setItem('prompt', query);
      sessionStorage.setItem('genre', genre);
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
  {#if token}
  <div class="user-menu">
    <button class="user-icon" on:click|preventDefault={(e) => { e.currentTarget.nextElementSibling.classList.toggle('active'); }}>
      👤
    </button>
    <div class="dropdown">
      <button class="logout-button" on:click={handleLogout}>Logout</button>
    </div>
  </div>
  {/if}
  <h1>AnimeFinder</h1>
  <p class="subtitle">Discover similar anime by genre and example!</p>

  {#if !token}
    <form class="auth-form" on:submit|preventDefault={handleAuth}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={username} required />
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={password} required />
      {#if isRegister}
        <label for="displayName">Display Name:</label>
        <input type="text" id="displayName" bind:value={displayName} required />
      {/if}
      <button type="submit" disabled={Loading || !username.trim() || !password.trim()}>
        {#if Loading}
          <span class="spinner"></span>
        {:else}
          {isRegister ? 'Register' : 'Login'}
        {/if}
      </button>
      <button type="button" on:click={() => (isRegister = !isRegister)}>
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
      {#if authError}
        <p class="error-message">{authError}</p>
      {/if}
    </form>
  {:else}
    <div class="welcome-banner">
      <div class="welcome-text">
        <span class="wave">👋</span> Welcome back, <span class="username">{displayName}</span>!
      </div>
    </div>

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
  {/if}
</main>