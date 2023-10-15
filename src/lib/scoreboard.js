
import { open } from 'node:fs/promises';
import { generate } from 'generate-passphrase'
import { v4 } from 'uuid';
import { time } from 'node:console';
// @ts-ignore
import * as Types from "./jsdoc-types.js";

import AsyncBlockingQueue from './AsyncBlockingQueue.js'

/** Generates a new game id
 * @function generateGameId
 * @returns {string} - an unique game id
 * */
export function generateGameId() {
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



/** Gets the saved score from the file system.
 * @async
 * @function getSavedScore
 * @returns {Promise<Types.Game>} */
export async function getSavedScore() {
    try {
        const file = await open('data/game.json', 'r');
        const content = await file.readFile('utf8');
        /** @type {Types.Game} */
        let data = JSON.parse(content);
        file.close();
        return data;
    } catch (error) {
        console.log(error)
        return await createNewGame();
    }
}

/** @returns {Types.Game} */
export function newGame() {
    return {
        scoreboardVisible: false,
        id: `${getTimestamp()}:${generateGameId()}`,
        type: '',
        state: {
            players: [{
                name: 'Player 1',
                score: 0
            }, {
                name: 'Player 2',
                score: 0
            }]
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
}

/** Creates a new game.json file and writes fills it with placeholder values
 * @async @function createNewGame
 * @returns {Promise<Types.Game>} 
 */
export async function createNewGame() {

    const file = await open('data/game.json', 'w+');
    /** @type {Types.Game} */
    const newGameData = newGame();
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
    /** @type {Types.Game} */
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
 * @returns {Promise<Types.Game>}
 */
export async function switchSides() {
    /** @type {Types.Game} */
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
    /** @type {Types.Game} */
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
    /** @type {Types.Game} */
    let data = await getSavedScore();
    const newFile = await open('data/game.json', 'w');
    data.scoreboardVisible = visible;
    await newFile.writeFile(JSON.stringify(data));
    newFile.close();
    return data;
}

/** @param {Types.Game} game */
export async function saveGame(game) {
    const newFile = await open('data/game.json', 'w+');
    await newFile.writeFile(JSON.stringify(game, null, 2), { encoding: 'utf8' });
    newFile.close();
    return game;
}