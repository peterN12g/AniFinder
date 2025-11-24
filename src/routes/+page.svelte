<script>
  import './styles.css';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let query = '', genre = '';
  let Loading = false;

  let email = '';
  let password = '';
  let displayName = '';
  let token = '';
  let authError = '';
  let isRegister = false;

  const API_BASE = "https://api.anifinder.peternguyen.me";

  onMount(() => {
    token = localStorage.getItem('token') || '';
    displayName = localStorage.getItem('displayName') || '';
  });

  async function handleAuth() {
    authError = '';
    Loading = true;

    try {
      const endpoint = isRegister ? "/api/signup" : "/api/login";

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      if (isRegister) {
        isRegister = false;
        authError = "Successfully registered! Please log in.";
      } else {
        token = data.token;
        displayName = data.displayName;
        localStorage.setItem("token", token);
        localStorage.setItem("displayName", displayName);
      }

    } catch (err) {
      authError = err.message;
    } finally {
      Loading = false;
    }
  }

  function handleLogout() {
    token = '';
    displayName = '';
    email = '';
    password = '';
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    authError = 'Logged out.';
  }

  async function onclick() {
    if (!token) {
      authError = "Please log in first.";
      return;
    }

    Loading = true;
    document.getElementById("Bind-Query").disabled = true;

    try {
      const resp = await fetch(
        `${API_BASE}/api/search?${new URLSearchParams({ prompt: query, genre })}`
      );

      if (!resp.ok) throw new Error(`Status ${resp.status}`);

      const responseInfo = await resp.json();

      sessionStorage.setItem("prompt", query);
      sessionStorage.setItem("genre", genre);
      sessionStorage.setItem(
        "animeResponse",
        JSON.stringify({
          title: responseInfo.title,
          bullets: responseInfo.bullets,
          imgLink: responseInfo.imgLink
        })
      );

      goto("/results");
    } catch (err) {
      console.error("Error:", err);
      sessionStorage.setItem(
        "animeResponse",
        JSON.stringify({
          title: "Error",
          bullets: ["An error occurred! Try again."],
          imgLink: ""
        })
      );
      goto("/results");
    } finally {
      document.getElementById("Bind-Query").disabled = false;
      Loading = false;
    }
  }
</script>

<main class="container">
  {#if token}
    <div class="user-menu">
      <button
        class="user-icon"
        on:click|preventDefault={(e) => {
          e.currentTarget.nextElementSibling.classList.toggle('active');
        }}>
        👤
      </button>
      <div class="dropdown">
        <button class="logout-button" on:click={handleLogout}>Logout</button>
      </div>
    </div>
  {/if}

  <h1>AnimeFinder</h1>
  <p class="subtitle">Discover similar anime by genre and reference!</p>

  {#if !token}
    <form class="auth-form" on:submit|preventDefault={handleAuth}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      <label>Email:</label>
      <input type="email" bind:value={email} required />

      <label>Password:</label>
      <input type="password" bind:value={password} required />

      {#if isRegister}
        <label>Display Name:</label>
        <input type="text" bind:value={displayName} required />
      {/if}

      <button type="submit" disabled={Loading}>
        {#if Loading}
          <span class="spinner"></span>
        {:else}
          {isRegister ? 'Register' : 'Login'}
        {/if}
      </button>

      <button type="button" on:click={() => (isRegister = !isRegister)}>
        {isRegister ? "Switch to Login" : "Switch to Register"}
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
      <label>Select Genre:</label>
      <select bind:value={genre} required>
        <option disabled value="">-- Choose Genre --</option>
        <option>Action</option>
        <option>Adventure</option>
        <option>Comedy</option>
        <option>Fantasy</option>
        <option>Horror</option>
        <option>Mystery</option>
        <option>Psychological</option>
        <option>Romance</option>
      </select>

      <label>Reference Anime:</label>
      <input type="text" bind:value={query} placeholder="e.g., Naruto" required />

      <button id="Bind-Query" type="submit" disabled={Loading || !query || !genre}>
        {#if Loading}
          <span class="spinner"></span>
        {:else}
          🔍 Search
        {/if}
      </button>
    </form>
  {/if}
</main>
