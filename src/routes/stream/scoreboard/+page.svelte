<script>
  import { onMount, onDestroy } from "svelte";
  import SpringedNumber from "$lib/SpringedNumber.svelte";
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
            <li class="score-container">
              <div class="nickname-box">
                <span class="nickname">{player.name}</span>
              </div>
              <div class="score-box">
                <span class="score">
                  <!-- <span> -->
                  <SpringedNumber
                    count={player.score}
                    spring_options={{ damping: 0.9, stiffness: 0.9 }}
                  />
                  <!-- </span> -->
                </span>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    {/if}
  {/if}
</main>

<style>
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
    overflow-x: hidden;
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
    font-family: sans-serif;
    font-size: 2em;
  }

  .score {
    color: white;
    font-size: 3em;
    font-weight: bold;
    font-family: sans-serif;
    text-align: center;
    min-width: 1em;
  }

  li {
    margin: 0px;
    padding: 0px;
    min-width: 200px;
    max-width: 750px;
    height: 85px;
    position: absolute;
    top: 50px;
    overflow: hidden;
    justify-content: flex-end;
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
