# AnkaPlay

Small maths and thinking games for children from 3 to 12 („अङ्क“ / *anka* = number), in German, English
and Nepali.

**Status: Neubau.** AnkaPlay is being rebuilt from the ground up, step by step. Three places so far: the pond
(„Teich“: frogs on two lily pads), the apple tree (picking, sharing among hares, the rest) and the burrow (hares
come out: how many are still inside?). An owl asks what the child is ready for, a simulated world is behind each
place, and every place has portals to exactly two others, each with a small picture of where it leads.
The old game (maps, stations, Berg, Eltern area) is kept in the git history at commit `5bad194`.

## Try it

```sh
node tools/serve.mjs        # then open http://localhost:8080 (Node 22 or newer, nothing to install)
```

## What is where

- `public/index.html`, `public/app.css`: the one page. Routes after `#`, see `engine/router.js`.
- `public/engine/ui/home.js`: Home: who plays (each child chooses an owl with a hat, `ui/owl.js`), the language,
  the door to the pond.
- `public/engine/`: what every place shares: who plays (`profiles.js`), languages (`i18n.js`, texts in
  `public/lang/`), the saved data on this device (`store.js`), and the screen parts in `ui/` (top bar, voice,
  sounds, buttons).
- `public/offen/`: the places. `places.js` the places and their two links each, `portals.js` the portals,
  `skills.js` what a child can (shared by all places), `figures.js` the drawn figures.
  - the pond: `teich.js` the screen, `world.js` the simulated frogs, `questions.js` the question catalogue,
    `owl.js` which question comes next, `runs.js`;
  - the apple tree: `apfelbaum.js` the screen, `apfel.js` its world and plan; the burrow: `bau.js`, `hasen.js`;
    both use the shared frame `scene.js`.
- `public/memory/`: the memory world, its own door on Home: three tables in a ring (numbers and dots, shapes,
  sums and their results from plus up to divided). `deck.js` the boards and levels, `memory.js` the screen.
- `public/datenschutz/`: the privacy policy.
- `public/sw.js`: offline after the first visit.

## Checks (Node 22 or newer)

```sh
node tools/check-offen.mjs     # simulated children at all places, the owl's choices, the portals, the texts
node tools/check-memory.mjs    # the memory boards: one partner per card, right sums, levels
node tools/check-offline.mjs   # sw.js lists every file (after a change: --write)
```

## Deploy

Plain HTML, CSS and JavaScript. No libraries, no build step, no tracking. Served as static files by the
Cloudflare Worker `anka-play` (`wrangler.jsonc`); every branch gets a preview link.
