<script>
  import { onMount, onDestroy } from "svelte";
  import { Input, Button, Label } from "sveltestrap";

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

  /** @type Game */
  let game;

  async function preload() {
    const res = await fetch("/stream/scoreboard/score");
    if (res.ok) {
      game = await res.json();
    }
  }

  let fetchInterval1 = 0;
  onDestroy(() => {
    clearInterval(fetchInterval1);
  });

  onMount(async () => {
    fetchInterval1 = setInterval(async () => {
      const res = await fetch("/stream/scoreboard/score");
      if (res.ok) {
        game = await res.json();
      }
    }, 333);

    console.log("mounted");
  });
</script>

<!-- <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
/> -->
{#await preload() then _}
  <main>
    <h1>Scoreboard</h1>
    <h2>Scoreboard is {game.scoreboardVisible ? "visible" : "hidden"}</h2>
    <button
      on:click={async () =>
        fetch("/stream/scoreboard/score/visibility", {
          method: "POST",
          body: JSON.stringify({ visible: true }),
        })}
    >
      Show Scoreboard
    </button>
    <button
      color="primary"
      on:click={async () =>
        fetch("/stream/scoreboard/score/visibility", {
          method: "POST",
          body: JSON.stringify({ visible: false }),
        })}
    >
      Hide Scoreboard
    </button>

    <h3>Players</h3>
    <label for="player1">Player 1 (left)</label><br />
    <input
      name="player1"
      id="player1name"
      type="text"
      placeholder={game.state.players[0].name}
    />
    <button
      on:click={() => {
        /* @typeof PlayerNameUpdate */
        let data = {
          playerIndex: 0,
          name: document.getElementById("player1name").value,
        };
        fetch("/stream/scoreboard/score/updateplayername", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }}>Set</button
    >
    <br />

    <label for="player2">Player 2 (right)</label><br />
    <input
      name="player2"
      id="player2name"
      type="text"
      placeholder={game.state.players[1].name}
    />
    <button
      on:click={() => {
        /* @typeof PlayerNameUpdate */
        let data = {
          playerIndex: 1,
          name: document.getElementById("player2name").value,
        };
        fetch("/stream/scoreboard/score/updateplayername", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }}>Set</button
    >
    <h2>Scores</h2>
    <h1>
      <div class="score-container">
        <div>
          {game.state.players[0].name} : {game.state.players[0].score}
          <button
            on:click={() => {
              /* @typeof ScoreUpdate */
              let data = {
                playerindex: 0,
                score: Number(game.state.players[0].score + 1),
              };
              fetch("/stream/scoreboard/score", {
                method: "POST",
                body: JSON.stringify(data),
              });
            }}>+</button
          >
          <button
            on:click={() => {
              /* @typeof ScoreUpdate */
              let data = {
                playerindex: 0,
                score: Number(game.state.players[0].score - 1),
              };
              fetch("/stream/scoreboard/score", {
                method: "POST",
                body: JSON.stringify(data),
              });
            }}>-</button
          >
        </div>
        <div>
          <button
            on:click={() => {
              /* @typeof ScoreUpdate */
              let data = {
                playerindex: 1,
                score: Number(game.state.players[1].score + 1),
              };
              fetch("/stream/scoreboard/score", {
                method: "POST",
                body: JSON.stringify(data),
              });
            }}>+</button
          >
          <button
            on:click={() => {
              /* @typeof ScoreUpdate */
              let data = {
                playerindex: 1,
                score: Number(game.state.players[1].score - 1),
              };
              fetch("/stream/scoreboard/score", {
                method: "POST",
                body: JSON.stringify(data),
              });
            }}>-</button
          >
          {game.state.players[1].score} : {game.state.players[1].name}
        </div>
      </div>
    </h1>
  </main>
{/await}

<style>
  button {
    padding-inline: 2rem;
    padding-block: 1rem;
  }
  input {
    padding-inline: 2rem;
    padding-block: 1rem;
    margin-bottom: 2rem;
  }

  .score-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
