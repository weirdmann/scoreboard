<script>
  import { onMount, onDestroy } from "svelte";
  import { io } from "socket.io-client";
  // @ts-ignore
  import * as Types from "$lib/jsdoc-types.js";

  const socket = io();
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("scoreboardupdate", handleScoreboardUpdate);
  1;
  /** @param {Types.Game} wsObj */
  async function handleScoreboardUpdate(wsObj) {
    game_data_loaded = true;
    game = wsObj;
  }
  /** @type {Types.Game} */
  let game;
  let game_data_loaded = false;
  let SC_UPD_EVENT = "scoreboardChangeRequest";
  /** @type {string}*/
  let player1name;
  /** @type {string}*/
  let player2name;
  /** @type {string}*/
  let gameType = "";

  let fetchInterval1 = 0;
  onDestroy(() => {
    clearInterval(fetchInterval1);
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

    // return if any of the input elements is focused
    if (document.activeElement?.tagName.toLowerCase() == "input") return;

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

{#if game_data_loaded}
  <div class="cloo-group flex-row center">
    {#if game.scoreboardVisible}
      <h1 style="color:var(--ctp-mocha-green)">Scoreboard is visible</h1>
    {:else}
      <h1 style="color:var(--ctp-mocha-red)">Scoreboard is hidden!</h1>
    {/if}
  </div>

  <div
    class="player-grid"
    style="padding:1ex; background: var(--ctp-mocha-surface1)"
  >
    <form class="cloo-group flex-col" style="grid-column:1/span 2">
      <label for="gametype">Game type</label>
      <input
        name="gametype"
        class="cloo-button"
        placeholder={game.type}
        bind:value={gameType}
      />
    </form>
    <form class="cloo-group flex-col" style="grid-column:1">
      <label for="player1-nickname">Player 1</label>
      <input
        name="player1-nickname"
        class="cloo-button"
        size="1"
        placeholder={game.state.players[0].name}
        bind:value={player1name}
      />
    </form>
    <form class="cloo-group flex-col" style="grid-column:2">
      <label for="player2-nickname">Player 2</label>
      <input
        name="player2-nickname"
        class="cloo-button"
        size="1"
        placeholder={game.state.players[1].name}
        bind:value={player2name}
      />
    </form>
    <button
      class="cloo-button cloo-bg-green"
      style="grid-column:1/span 2"
      on:click={() => {
        if (player1name != "") {
          socket.emit(SC_UPD_EVENT, {
            playerindex: 0,
            name: player1name,
          });
          player1name = "";
        }
        if (player2name != "") {
          socket.emit(SC_UPD_EVENT, {
            playerindex: 1,
            name: player2name,
          });
          player2name = "";
        }
        if (gameType != "") {
          socket.emit(SC_UPD_EVENT, {
            type: gameType,
          });
          gameType = "";
        }
      }}><span>apply</span></button
    >
  </div>
  <div
    class="player-grid"
    style="padding:1ex; background: var(--ctp-mocha-surface1)"
  >
    <div class="cloo-group flex-col">
      <form class="cloo-group flex-col">
        <button
          class="cloo-button cloo-bg-green score-button"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 0,
              scoreDelta: 1,
            });
          }}><span>+1</span></button
        >

        <div class="score">{game.state.players[0].score}</div>
        <button
          class="cloo-button cloo-bg-red score-button"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 0,
              scoreDelta: -1,
            });
          }}><span>-1</span></button
        >
      </form>
    </div>
    <div class="cloo-group flex-col">
      <form class="cloo-group flex-col">
        <button
          class="cloo-button cloo-bg-green score-button"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 1,
              scoreDelta: 1,
            });
          }}><span>+1</span></button
        >
        <div class="score">{game.state.players[1].score}</div>
        <button
          class="cloo-button cloo-bg-red score-button"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 1,
              scoreDelta: -1,
            });
          }}><span>-1</span></button
        >
      </form>
    </div>
  </div>

  <a
    class=""
    href="#"
    on:click|preventDefault={async () => {
      socket.emit(SC_UPD_EVENT, { scoreboardVisible: !game.scoreboardVisible });
    }}><i>> Toggle visibility</i></a
  >
  <a
    class=""
    href="#"
    on:click|preventDefault={async () => {
      socket.emit(SC_UPD_EVENT, { swap: true });
    }}><i>> Swap sides</i></a
  >
  <a
    class="cloo-bg-red"
    href="#"
    on:click|preventDefault={async () => {
      socket.emit(SC_UPD_EVENT, { reset: true });
    }}
    ><i
      >> Reset the game <br /> (hides the scoreboard, resets player names to default
      and zeroes the scores!)</i
    ></a
  >

  <!-- ///////////////////// OLD CODE//////////////////////////////////////////////////////////////////////// -->
{:else}
  <h1>Loading...</h1>
{/if}

<style>
  @import url("https://unpkg.com/@catppuccin/palette/css/catppuccin.css");

  ::selection {
    background-color: var(--material-selection-background);
    color: var(--material-selection-foreground);
    mix-blend-mode: add;
  }

  body {
    margin: auto;
    padding: 0px;
    display: flex;
    flex-direction: column;
    max-width: 520px;
    width: 100vw;
    color: var(--ctp-mocha-text);
    background: var(--ctp-mocha-base);
    padding-bottom: 10em;
  }

  body > * {
    margin-top: 1em;
    /*   width: 100%; */
  }

  h1 {
    margin: 0px;
  }

  * {
    box-sizing: border-box;
    font-family: consolas;
    color: var(--ctp-mocha-teal);
  }

  .cloo-group {
    display: flex;
    justify-items: flex-start;
    justify-content: space-evenly;
    gap: 0.5ex;
  }

  .center {
    justify-items: center;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-row {
    flex-direction: row;
    width: 100%;
  }

  .cloo-button {
    background-color: var(--ctp-mocha-mantle);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 0px solid;
    flex-grow: 1;
    position: relative;
  }

  .cloo-button > span {
    font-size: 130%;
  }

  .cloo-button:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    mix-blend-mode: screen;
    z-index: 1;
  }

  .cloo-button:active::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    mix-blend-mode: screen;
    z-index: 2;
  }

  .cloo-button > span {
    padding-inline: 1ex;
    padding-top: 1ex;
    padding-bottom: 1ex;
  }

  #scoreboard-visible {
    background-color: #651111;
  }

  #scoreboard-visible[data-active="true"] {
    background-color: #115611;
  }

  .cloo-border {
    border: 2px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(
      -25deg,
      var(--material-border),
      var(--material-border)
    );
  }

  .cloo-bg-green * {
    color: var(--ctp-mocha-green);
  }

  .cloo-bg-red * {
    color: var(--ctp-mocha-red);
  }

  .cloo-divide {
    gap: 0px;
  }

  .flex-row.cloo-divide > * + * {
    border-color: #303a3f;
    border-right-width: 0px;
    border-left-width: 1px;
  }

  .flex-col.cloo-divide > * + * {
    border-color: #303a3f;
    border-bottom-width: 0px;
    border-top-width: 2px;
  }

  .score {
    font-size: 2em;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .score-button span {
    padding-top: 2ex;
    padding-bottom: 2ex;
  }

  input {
    text-align: center;
    font-size: 1.2em;
    min-width: 5em;
    padding: 0.4em;
  }

  .player-grid {
    width: 100%;
    display: grid;
    gap: 1ex;
    grid-template-columns: repeat(2, 1fr);
  }

  .player-grid > *::nth-of-type(1) {
    grid-column: 1;
  }

  .player-grid > *::nth-of-type(2) {
    grid-column: 2;
  }

  a {
    margin-top: 1em;
    padding-top: 1em;
    padding-bottom: 1em;

    text-decoration-color: var(--ctp-mocha-overlay2);
  }

  a:last-of-type {
    margin-top: 4em;
  }

  label {
    font-size: 0.8em;
    text-align: center;
    color: var(--ctp-mocha-overlay2);
  }
</style>
