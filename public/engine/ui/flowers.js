// The Tal's reward, as in think-lab's nature world: every round finished at a station grows a flower there.
// The done screen shows the station's flower bed (engine/ui/play.js); the map shows the same flowers around the
// station, and the newest one blooms there once (engine/ui/map.js, store "newFlower"). A map has it with
// reward: "flowers" (content/universe.js).

import { state } from "../app.js";

/** A station has room for this many flowers. */
export const BED = 12;
export const FLOWERS = ["🌸", "🌼", "🌷", "🌺"];

/** The flowers grown at a station: one per finished round of its ideas. */
export const flowersAt = (s) => s.ideas.reduce((n, id) => n + (state.rec.ideas[id]?.rounds ?? 0), 0);
