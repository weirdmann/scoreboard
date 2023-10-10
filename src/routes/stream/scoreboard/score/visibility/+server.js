

import { changeVisibility } from '$lib/scoreboard.js';
import { request } from 'http';

/**
 * @typedef VisibilityUpdate
 * @type {object}
 * @property {boolean} visible 
 * @returns 
 */

export let POST = async (event) => {
    /** @type {VisibilityUpdate} */
    const requestBody = await event.request.json();
    if ('visible' in requestBody) {
        await changeVisibility(requestBody.visible);
    }
    return new Response(null, {
        status: 200
    });
}