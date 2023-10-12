import { open } from 'node:fs/promises';
import { generate } from 'generate-passphrase'
import { v4 } from 'uuid';
import { time } from 'node:console';

import AsyncBlockingQueue from './AsyncBlockingQueue.js'

/** Generates a new game id
 * @function generateGameId
 * @returns {string} - an unique game id
 * */
function generateGameId() {
    return generate({ length: 3, separator: '-', titlecase: true });
}

/** Get timestamp for file names
 * @returns {string} - a timestamp in the format YYMMDDHHmmss
 */
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * @typedef Player
 * @type {object}
 * @property {string} name - player name.
 * @property {number} score - player score.
 */

/**
 * @typedef GameState
 * @type {object}
 * @property {Array<Player>} players - an ID.
 */

/** 
 * @typedef Game
 * @type {object} 
 * @property {boolean} scoreboardVisible - whether the scoreboard is visible
 * @property {string} id - an unique game id
 * @property {GameState} state - the current game state
 * @property {Array<GameHistory>} history of game states
 */

/**
 * @typedef GameHistory
 * @type {object}
 * @property {string} change - the change that was made
 * @property {GameState} state - the state before the change
 */

/** Gets the saved score from the file system.
 * @async
 * @function getSavedScore
 * @returns {Promise<Game>} */
export async function getSavedScore() {
    const file = await open('data/game.json', 'r');
    const content = await file.readFile('utf8');
    /** @type {Game} */
    let data = JSON.parse(content);
    file.close();
    return data;
}

/** Creates a new game.json file and writes fills it with placeholder values
 * @async @function createNewGame
 * @returns {Promise<Game>} 
 */
export async function createNewGame() {
    // if exists, save old file to /old folder
    // with timestamp name
    const oldFile = await open('data/game.json', 'r');
    /** @type {Game} */
    let oldData;
    if (oldFile) {
        const oldContent = await oldFile.readFile('utf8');
        oldData = JSON.parse(oldContent);
        const newFileName = `data/old/game-${oldData.state.players[0].name}vs${oldData.state.players[1].name}-${getTimestamp()}.json`;
        const newFile = await open(newFileName, 'w', 0o777);
        await newFile.writeFile(oldContent);
        newFile.close();
        oldFile.close();
    }

    const file = await open('data/game.json', 'w');
    /** @type {Game} */
    const newGameData = {
        id: `${getTimestamp()}:${generateGameId()}`,
        scoreboardVisible: false,
        state: {
            players: [
                { name: 'player1', score: 0 },
                { name: 'player2', score: 0 },
            ]
        },
        history: [
            {
                change: 'init',
                state: {
                    players: [
                        { name: '', score: 0 },
                        { name: '', score: 0 },
                    ]
                }
            }
        ]
    }
    const content = JSON.stringify(newGameData);
    await file.writeFile(content);
    file.close();
    return newGameData;
}


/** Updates the score and saves it to the file system, 
 * updating the history
 * @async
 * @function updateScore
 * @param {number} playerIndex - the index of the player to update
 * @param {number} score - the new score
 */
export async function updateScore(playerIndex, score) {
    /** @type {Game} */
    let data = await getSavedScore();
    // sanitize input
    if (playerIndex < 0 || playerIndex > data.state.players.length - 1) {
        throw new Error('playerIndex out of bounds');
    }
    data.history.push({
        change: `player ${playerIndex} score updated to ${score}`,
        state: data.state
    });
    const newFile = await open('data/game.json', 'w');
    data.state.players[playerIndex].score = score;
    await newFile.writeFile(JSON.stringify(data));
    newFile.close();
    return data;
}

/** Switch sides - swap players
 * @async
 * @function switchSides
 * @returns {Promise<Game>}
 */
export async function switchSides() {
    /** @type {Game} */
    let data = await getSavedScore();
    data.history.push({
        change: 'players switched sides',
        state: data.state
    });
    const newFile = await open('data/game.json', 'w');
    const temp = data.state.players[0];
    data.state.players[0] = data.state.players[1];
    data.state.players[1] = temp;
    await newFile.writeFile(JSON.stringify(data));
    return data;
}

/** Update player name
 * @async
 * @function updatePlayerName
 * @param {number} playerIndex - the index of the player to update
 * @param {string} name - the new name
 */
export async function updatePlayerName(playerIndex, name) {
    /** @type {Game} */
    let data = await getSavedScore();
    // sanitize input
    if (playerIndex < 0 || playerIndex > data.state.players.length - 1) {
        throw new Error('playerIndex out of bounds');
    }
    data.history.push({
        change: `player ${playerIndex} name updated to ${name}`,
        state: data.state
    });
    const newFile = await open('data/game.json', 'w');
    data.state.players[playerIndex].name = name;
    await newFile.writeFile(JSON.stringify(data, null, 2));
    newFile.close();
    return data;
}

/** Change visibility
 * @async
 * @function changeVisibility
 * @param {boolean} visible - whether the scoreboard should be visible
 */
export async function changeVisibility(visible) {
    /** @type {Game} */
    let data = await getSavedScore();
    const newFile = await open('data/game.json', 'w');
    data.scoreboardVisible = visible;
    await newFile.writeFile(JSON.stringify(data));
    newFile.close();
    return data;
}

/** @param {Game} game */
export async function saveGame(game) {
    const newFile = await open('data/game.json', 'w');
    await newFile.writeFile(JSON.stringify(game, null, 2));
    newFile.close();
    return game;
}