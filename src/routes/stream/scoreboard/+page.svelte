<script>
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  /**
   * @typedef {import('$lib/scoreboard.js').GameState} GameState
   */
  /**
   * @typedef {import('$lib/scoreboard.js').Game} Game
   */
  /** @type Game */
  export let game;

  async function preload() {
    const res = await fetch("/stream/scoreboard/score");
    if (res.ok) {
      game = await res.json();
    }
  }
  onDestroy(() => {
    clearInterval(fetchInterval);
  });
  let fetchInterval = 0;
  onMount(async () => {
    fetchInterval = setInterval(async () => {
      const res = await fetch("/stream/scoreboard/score");
      if (res.ok) {
        game = await res.json();
      }
    }, 333);
    console.log("mounted");

    window.addEventListener("keypress", keypress);
  });

  async function keypress(e) {
    if (e.key == "1") {
      let data = {
        playerindex: 0,
        score: Number(game.state.players[0].score + 1),
      };
      fetch("/stream/scoreboard/score", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } else if (e.key == "2") {
      let data = {
        playerindex: 1,
        score: Number(game.state.players[1].score + 1),
      };
      fetch("/stream/scoreboard/score", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } else if (e.key == "3") {
      let data = {
        playerindex: 0,
        score: Number(0),
      };
      await fetch("/stream/scoreboard/score", {
        method: "POST",
        body: JSON.stringify(data),
      });
      data = {
        playerindex: 1,
        score: Number(0),
      };
      await fetch("/stream/scoreboard/score", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  }
</script>

<main>
  {#await preload() then _}
    {#if game.scoreboardVisible}
      {#if game.state.players.length > 0}
        <ul transition:fade={{ duration: 1000 }}>
          {#each game.state.players as player}
            <li class="score-container">
              <div class="nickname-box">
                <span class="nickname">{player.name}</span>
              </div>
              <div class="score-box">
                <span class="score">
                  {#key player.score}
                    <span in:fly={{ y: 50, duration: 500 }}>{player.score}</span
                    >
                  {/key}
                </span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  {/await}
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Arvo");
  /* box sizing */

  :root {
    box-sizing: border-box;
    background-color: black;
  }

  main {
    font-family: sans-serif;
  }

  ul {
    margin: 0px;
    padding: 0px;
    list-style: none;
  }

  div.nickname-box {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: rgb(120, 120, 120, 0.5);
  }

  div.score-box {
    height: 100%;
    width: fit-content;
    display: flex;
    align-items: center;
    background-color: rgb(180, 180, 180, 0.5);
    transition: width 1s ease-in-out;
  }

  .nickname {
    display: block;
    padding-inline: 1rem;
    color: white;
    font-family: "Arvo", serif;

    font-size: 2.5em;
  }

  .score {
    color: white;
    font-size: 3em;
    font-weight: bold;
    font-family: "Arvo", serif;
    padding-inline: 1rem;
    text-align: center;
    min-width: 1em;
  }

  li {
    margin: 0px;
    padding: 0px;
    width: 400px;
    min-width: fit-content;
    height: 75px;
    position: absolute;
    top: 50px;
  }

  li:nth-of-type(odd) {
    left: 0;
    display: flex;
    flex-direction: row;
  }

  li:nth-of-type(even) {
    right: 0;
    display: flex;
    flex-direction: row-reverse;
  }

  li:nth-of-type(even) div.nickname-box {
    justify-content: flex-start;
  }
</style>
