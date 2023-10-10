import { json } from '@sveltejs/kit';
import { open } from 'node:fs/promises';
import { getSavedScore, updateScore } from '$lib/scoreboard';

export async function GET() {
    return json(await getSavedScore());
}

/**
 * @typedef {Object} ScoreUpdate
 * @property {number} playerindex
 * @property {number} score
 */

/** Update player's score
 * @async
 * @function POST
 */
export async function POST(event) {
    /** @type {ScoreUpdate} */
    const body = await event.request.json();
    const changed = await updateScore(body.playerindex, body.score);
    return json(changed);
}
