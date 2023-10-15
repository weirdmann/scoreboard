
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
 * @property {string} type - the type of game
 * @property {GameState} state - the current game state
 * @property {Array<GameHistory>} history of game states
 * @constructor
 */




/**
 * @typedef GameHistory
 * @type {object}
 * @property {string} change - the change that was made
 * @property {GameState} state - the state before the change
 */



export const Types = {};