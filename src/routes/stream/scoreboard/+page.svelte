<script>
  import { onMount, onDestroy } from "svelte";
  import SpringedNumber from "$lib/SpringedNumber.svelte";
  import { io } from "socket.io-client";
  import { fade } from "svelte/transition";

  const socket = io();
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("scoreboardupdate", handleScoreboardUpdate);
  1;
  /** @param {Game} wsObj */
  async function handleScoreboardUpdate(wsObj) {
    game_data_loaded = true;
    game = wsObj;
  }

  /**
   * @typedef {import('$lib/scoreboard.js').GameState} GameState
   */
  /**
   * @typedef {import('$lib/scoreboard.js').Game} Game
   */
  /** @type Game */
  let game;
  let game_data_loaded = false;

  onDestroy(() => {
    socket.disconnect();
  });
  onMount(async () => {
    window.addEventListener("keypress", (e) => keypress(e));
  });

  /**
   * @param {*} event
   * */
  function keypress(event) {
    const SC_UPD_EVENT = "scoreboardChangeRequest";

    if (
      event.code != "Digit1" &&
      event.code != "Digit2" &&
      event.code != "Digit3"
    )
      return;

    if (event.code == "Digit1") {
      event.preventDefault();
      socket.emit(SC_UPD_EVENT, {
        playerindex: 0,
        scoreDelta: 1,
      });
    } else if (event.code == "Digit2") {
      event.preventDefault();
      socket.emit(SC_UPD_EVENT, {
        playerindex: 1,
        scoreDelta: 1,
      });
    } else if (event.code == "Digit3") {
      event.preventDefault();
      1;
      socket.emit(SC_UPD_EVENT, {
        playerindex: 0,
        score: 0,
      });
      socket.emit(SC_UPD_EVENT, {
        playerindex: 1,
        score: 0,
      });
    }
  }
</script>

<main>
  {#if game_data_loaded}
    {#if game.scoreboardVisible}
      {#if game.state.players.length > 0}
        <ul>
          {#each game.state.players as player}
            <li transition:fade class="score-container">
              <div class="nickname-box">
                <span class="nickname">{player.name}</span>
              </div>
              <div class="score-box">
                <span class="score">
                  <!-- <span> -->
                  <SpringedNumber
                    count={player.score}
                    spring_options={{ damping: 0.4, stiffness: 0.1 }}
                  />
                  <!-- </span> -->
                </span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
    <div class="game-type-pos">
      <div class="game-type-container" hidden={game.type.length == 0}>
        <span class="game-type">{game.type}</span>
      </div>
    </div>
  {/if}
</main>

<style>
  :root {
    box-sizing: border-box;
    background-color: transparent;
    --nickname-bg: rgb(50, 50, 50, 0.8);
    --score-bg: rgb(100, 100, 100, 0.5);
    --game-type-bg: rgb(50, 50, 50, 0.8);
    --text-outline-width: 2px;

    --score-box-shadow-width: 5px;
    --score-box-shadow-color: black;
  }

  main {
    font-family: sans-serif;
    text-shadow: var(--text-outline-width) var(--text-outline-width) 0 #000,
      calc(0px - var(--text-outline-width)) var(--text-outline-width) 0 #000,
      calc(0px - var(--text-outline-width))
        calc(0px - var(--text-outline-width)) 0 #000,
      var(--text-outline-width) calc(0px - var(--text-outline-width)) 0 #000;
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
    background-color: var(--nickname-bg);
    overflow-x: hidden;
  }

  div.score-box {
    height: 100%;
    width: fit-content;
    display: flex;
    align-items: center;
    background-color: var(--score-bg);
    transition: width 1s ease-in-out;
  }

  .nickname {
    display: block;
    padding-inline: 1rem;
    color: white;
    font-family: Blowbrush, sans-serif;
    text-transform: uppercase;
    font-size: 2.5em;
  }

  .score {
    color: white;
    font-size: 3em;
    font-weight: bold;
    font-family: Blowbrush, sans-serif;
    text-align: center;
    min-width: 1em;
  }

  li {
    margin: 0px;
    padding: 0px;
    min-width: 200px;
    max-width: 750px;
    height: 75px;
    position: absolute;
    top: 0px;
    overflow: hidden;
    justify-content: flex-end;
  }

  li:nth-of-type(odd) {
    /* left: 0; */
    right: calc(50% + 10%);
    display: flex;
    flex-direction: row;
  }

  li:nth-of-type(even) {
    /* right: 0; */
    left: calc(50% + 10%);
    display: flex;
    flex-direction: row-reverse;
  }

  li:nth-of-type(even) div.nickname-box {
    justify-content: flex-start;
  }

  div.game-type-pos {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div.game-type-container {
    position: absolute;
    color: white;
    font-size: 2em;
    top: 0;
    padding-inline: 4rem;
    padding-block-start: 0.5rem;
    padding-block-end: 0.5rem;
    text-align: center;
    font-family: Blowbrush, sans-serif;
    text-transform: uppercase;
    font-size: 2em;
    background-color: var(--game-type-bg);
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
    overflow: hidden;
  }
</style>
