import { switchSides } from "$lib/scoreboard";
import { json } from '@sveltejs/kit';

export async function GET() {
    let data = await switchSides();
    return json(data);
}