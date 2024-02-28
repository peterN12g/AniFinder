<script context="module">
  import { GoogleGenerativeAI } from "@google/generative-ai";
  import { run } from './+server';
  let query = "";

</script>

<html lang="en">
  <body>
    <h1>Welcome to AnimeFinder</h1>
    <p>
      Describe the type of anime you're in the mood for, and any specific elements you enjoy.
      <input type="text" bind:value={query}>
      <button class="Bind-Query" on:click={()=> run(prompt)}>Search</button>
    </p>
  </body>
</html>

<style>
  body {
    background-color: purple;
  }

  h1{
    text-align: center;
  }

  p{
    text-align: center;
    font-size: 1.1em;
  }

  button.Bind-Query{
    margin-left: auto;
    margin-right: auto;
    display: flex;
    margin-top: 5px;
  }

  input{
    display: flex;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    width: 15%;
  }
</style>

