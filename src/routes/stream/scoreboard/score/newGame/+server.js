import { json, redirect } from '@sveltejs/kit';
import {
    createNewGame
} from '$lib/scoreboard';

export async function GET() {
    let data = await createNewGame();
    return json(data);
}
