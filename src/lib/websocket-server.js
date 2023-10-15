
import { Server, Socket } from 'socket.io'
import { defineConfig } from 'vite';
import AsyncBlockingQueue from './AsyncBlockingQueue.js';
import { getSavedScore, saveGame, generateGameId, newGame } from './scoreboard.js'
// @ts-ignore
import * as Types from './jsdoc-types.js';
// jsdoc import game type from scoreboard.js


/** @type {Types.Game} */
let game;

let queue = new AsyncBlockingQueue();

export const webSocketServer = {
    name: 'webSocketServer',

    /** @param {*} server - http server */
    async configureServer(server) {
        const io = new Server(server.httpServer)

        game = await getSavedScore();

        io.on('connection', (socket) => {
            socket.emit('eventFromServer', 'Hello from the server 👁️✈️😊')
            socket.emit('scoreboardupdate', game)

            socket.on('scoreboardChangeRequest', (data) => {
                //console.log(data)
                //scoreboardChangeRequest(data)
                queue.enqueue(data)
                //console.log(queue)
            })
        })

        setInterval(async () => {
            let new_game_data = false;
            while (!queue.isEmpty()) {
                let obj = await queue.dequeue();
                scoreboardChangeRequest(obj);
                new_game_data = true;
            }
            if (new_game_data) {
                io.emit('scoreboardupdate', game);
                await saveGame(game);
            }
        }, 50);

    }
}



/** @param {Socket} socket */
async function updateScoreboard(socket) {
    const data = await getSavedScore();
    socket.emit('scoreboardupdate', data);
}

/** @param {*} changeObject */
async function scoreboardChangeRequest(changeObject) {
    if ('reset' in changeObject) {
        game = newGame();
    }
    if ('playerindex' in changeObject) {
        if ('scoreDelta' in changeObject) {
            game.history.push({
                change: `player ${changeObject.playerindex} scored ${changeObject.scoreDelta > 0 ? '+' : ''}${changeObject.scoreDelta}`,
                state: { ...game.state }
            });
            game.state.players[changeObject.playerindex].score += changeObject.scoreDelta;
        }
        if ('score' in changeObject) {
            game.history.push({
                change: `player ${changeObject.playerindex} score updated to ${changeObject.score}`,
                state: { ...game.state }
            });
            game.state.players[changeObject.playerindex].score = changeObject.score;

        }
        if ('name' in changeObject) {
            game.history.push({
                change: `player ${changeObject.playerindex} name changed to ${changeObject.score}`,
                state: { ...game.state }
            });
            game.state.players[changeObject.playerindex].name = changeObject.name;
        }
    }
    if ('scoreboardVisible' in changeObject) {
        game.scoreboardVisible = changeObject.scoreboardVisible;
    }
    if ('swapSides' in changeObject) {
        game.history.push({
            change: `players swapped sides`,
            state: { ...game.state }
        });
        let temp = game.state.players[0];
        game.state.players[0] = game.state.players[1];
        game.state.players[1] = temp;
    }
    if ('undo' in changeObject) {
        if (game.history.length == 0) return;
        console.log(game.history[game.history.length - 1].state);
        game.state = { ...game.history[game.history.length - 1].state };
        game.history.pop();
    }
    if ('type' in changeObject) {
        game.type = changeObject.type;
    }
}
