import { json } from '@sveltejs/kit';
import { updatePlayerName } from '$lib/scoreboard';

/** @typedef PlayerNameUpdate
 * @property {number} playerIndex - the index of the player to update
 * @property {string} name - the new name
 */

export async function POST(event) {
    /** @type {PlayerNameUpdate} */
    const requestBody = await event.request.json();
    const data = await updatePlayerName(requestBody.playerIndex, requestBody.name);
    return json(data);
}