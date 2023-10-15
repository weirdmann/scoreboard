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
  <main style="color: rgba(250, 235, 215, 0.447)">
    <button
      class="cloo-input"
      style="background-color: darkred"
      on:click={async () => {
        socket.emit(SC_UPD_EVENT, { undo: true });
      }}
      hidden
    >
      Undo
    </button>
    {#if game.scoreboardVisible}
      <h2 style="color: green">Scoreboard is visible</h2>
    {:else}
      <h2 style="color: red">Scoreboard is hidden!</h2>
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
        style="background-color: darkred"
        on:click={async () => {
          socket.emit(SC_UPD_EVENT, { reset: true });
        }}
      >
        Reset the Game
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
    <h2>Players</h2>
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
        <form
          on:submit|preventDefault={() => {
            socket.emit(SC_UPD_EVENT, {
              type: gameType,
            });
          }}
        >
          <label for="gameType">Game Type</label><br />
          <input
            class="cloo-input"
            type="text"
            placeholder={game.type}
            bind:value={gameType}
          />
          <button class="cloo-input" type="submit">Set</button>
        </form>
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
    <div class="score-container">
      <div>
        <span class="score-playername">
          {game.state.players[0].name}
        </span>
        <div class="score-controls">
          <button
            class="cloo-input"
            on:click={() => {
              socket.emit(SC_UPD_EVENT, {
                playerindex: 0,
                scoreDelta: 1,
              });
            }}>+</button
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
            }}>-</button
          >
        </div>
        <div>
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
      </div>
      <div>
        <button
          class="cloo-input swap-button"
          style="font-size:0.5em"
          on:click={() => {
            socket.emit(SC_UPD_EVENT, {
              swapSides: true,
            });
          }}>swap<br />sides</button
        >
      </div>
      <div>
        <span class="score-playername">
          {game.state.players[1].name}
        </span>
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
  </main>
{:else}
  <h1>Loading...</h1>
{/if}

<style>
  :root {
    font-size: 1rem;
    /* min-width: 420px; */
  }

  h2 {
    text-align: center;
  }

  .cloo-input {
    background-color: rgb(16, 11, 8);
    color: antiquewhite;
    border: 1px solid rgb(84, 63, 35);
    border-radius: 1rem;
  }

  button {
    padding-inline: 1rem;
    padding-block: 1rem;
  }

  input {
    padding-inline: 1rem;
    padding-block: 0.5rem;
    margin-bottom: 1rem;
    width: 5em;
  }

  label {
    font-size: 0.8em;
  }

  .visibility-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  .score-container {
    display: flex;
    gap: 1rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .score-controls {
    display: flex;
    gap: 1ex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .score-playername {
    font-size: 1rem;
  }

  .score-num {
    font-size: 1rem;
    width: 2ex;
    font-family: Consolas;
  }

  .score-container > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .swap-button {
    font-size: 0.5em;
    padding-inline: 0.5rem;
    padding-block: 0.5rem;
    height: 4em;
  }

  div.players {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
