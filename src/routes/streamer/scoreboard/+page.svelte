<script>
  import { onMount, onDestroy } from "svelte";
  import { Input, Button, Label } from "sveltestrap";
  import { io } from "socket.io-client";

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
  /** @type Game */
  let game;
  let game_data_loaded = false;
  let SC_UPD_EVENT = "scoreboardChangeRequest";
  /** @type {string}*/
  let player1name;
  /** @type {string}*/
  let player2name;
  /**
   * @typedef {import('$lib/scoreboard.js').GameState} GameState
   */
  /**
   * @typedef {import('$lib/scoreboard.js').Game} Game
   */
  /** @typedef PlayerNameUpdate
   * @property {number} playerIndex - the index of the player to update
   * @property {string} name - the new name
   */

  /**
   * @typedef {Object} ScoreUpdate
   * @property {number} playerindex
   * @property {number} score
   */

  let fetchInterval1 = 0;
  onDestroy(() => {
    clearInterval(fetchInterval1);
  });

  onMount(async () => {
    console.log("mounted");
  });
</script>

<!-- <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
/> -->
{#if game_data_loaded}
  <main>
    {#if game.scoreboardVisible}
      <h1 style="color: green">Scoreboard is visible</h1>
    {:else}
      <h1 style="color: red">Scoreboard is hidden!</h1>
    {/if}
    <div class="visibility-controls">
      <button
        class="cloo-input"
        on:click={async () => {
          socket.emit(SC_UPD_EVENT, { scoreboardVisible: true });
        }}
      >
        Show Scoreboard
      </button>
      <button
        class="cloo-input"
        color="primary"
        on:click={async () =>
          socket.emit(SC_UPD_EVENT, { scoreboardVisible: false })}
      >
        Hide Scoreboard
      </button>
    </div>
    <h3>Players</h3>
    <div class="players">
      <div>
        <label for="player1">Player 1 (left)</label><br />
        <input
          class="cloo-input"
          name="player1"
          id="player1name"
          type="text"
          placeholder={game.state.players[0].name}
          bind:value={player1name}
        />
        <button
          class="cloo-input"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 0,
              name: player1name,
            });
          }}>Set</button
        >
      </div>
      <div>
        <label for="player2">Player 2 (right)</label><br />
        <input
          class="cloo-input"
          name="player2"
          id="player2name"
          type="text"
          placeholder={game.state.players[1].name}
          bind:value={player2name}
        />
        <button
          class="cloo-input"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              playerindex: 1,
              name: player2name,
            });
          }}>Set</button
        >
      </div>
    </div>
    <h1>
      <div class="score-container">
        <div>
          <div class="score-playername">
            {game.state.players[0].name}
          </div>
          <div class="score-controls">
            <button
              class="cloo-input"
              on:click={() => {
                socket.emit(SC_UPD_EVENT, {
                  playerindex: 0,
                  scoreDelta: 1,
                });
              }}>+1</button
            >
            <span class="score-num">
              {game.state.players[0].score}
            </span>
            <button
              class="cloo-input"
              on:click={() => {
                socket.emit(SC_UPD_EVENT, {
                  playerindex: 0,
                  scoreDelta: -1,
                });
              }}>-1</button
            >
          </div>
          <button
            class="cloo-input"
            style="margin-top:1rem"
            on:click={() => {
              socket.emit(SC_UPD_EVENT, {
                playerindex: 0,
                score: 0,
              });
            }}>zero</button
          >
        </div>
        <button
          class="cloo-input"
          style="font-size:0.5em"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              swapSides: true,
            });
          }}>swap<br />sides</button
        >
        <div>
          <div>
            {game.state.players[1].name}
          </div>
          <div class="score-controls">
            <button
              class="cloo-input"
              on:click={() => {
                socket.emit(SC_UPD_EVENT, {
                  playerindex: 1,
                  scoreDelta: 1,
                });
              }}>+</button
            >
            <span class="score-num">
              {game.state.players[1].score}
            </span>
            <button
              class="cloo-input"
              on:click={() => {
                socket.emit(SC_UPD_EVENT, {
                  playerindex: 1,
                  scoreDelta: -1,
                });
              }}>-</button
            >
          </div>
          <button
            class="cloo-input"
            style="margin-top:1rem"
            on:click={() => {
              socket.emit(SC_UPD_EVENT, {
                playerindex: 1,
                score: 0,
              });
            }}>zero</button
          >
        </div>
      </div>
    </h1>
  </main>
{:else}
  <h1>Loading...</h1>
{/if}

<style>
  :root {
    color: rgba(250, 235, 215, 0.447);
    font-size: 1.2rem;
    min-width: 960px;
  }

  .cloo-input {
    background-color: rgb(16, 11, 8);
    color: antiquewhite;
    /* border: 1px solid rgb(84, 63, 35); */
    border-radius: 1rem;
  }

  button {
    padding-inline: 2rem;
    padding-block: 1rem;
  }

  input {
    padding-inline: 2rem;
    padding-block: 1rem;
    margin-bottom: 2rem;
  }

  .visibility-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .score-container {
    display: flex;
    gap: 0.5em;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .score-controls {
    display: flex;
    gap: 0.5em;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .score-num {
    font-size: 4rem;
    font-family: Consolas;
  }

  div.players {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
