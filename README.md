# AnkaPlay

Small maths and thinking games for children from 3 to 12 („अङ्क“ / *anka* = number), in German, English
and Nepali. The new, generalised version of [think-lab](https://github.com/ahaluma/think-lab): one engine,
and everything else (maps, stations, paths, portals, rules, tasks, texts) is data.

**Status:** the engine runs, and the whole Tal (the valley, ages 3 to 6) can be played on a phone: twelve
stations, eleven ideas in all five ways of playing each, and number memory at the tree stump. Fluss, Feld
and Berg are on the way. The design is in [docs/DESIGN.md](docs/DESIGN.md); section 11 is the
order of work.

## Try it

```sh
node tools/serve.mjs        # then open http://localhost:8080 (Node 22 or newer, nothing to install)
```

## What is where

- `public/index.html`, `public/app.css`: the one page. Routes after `#` (`#/`, `#/map/tal`, `#/s/wiese`,
  `#/s/wiese/sehen`), see `engine/router.js`.
- `public/content/`: the universe as data (maps, stations, paths, portals, nearness, Home doors), the
  perspectives, the policies (how a child moves up and down), the board catalogue.
- `public/engine/`: the code, the same for every station.
  - `graph.js` open, visible, reachable, the journey; `recipe.js` tasks from recipes; `learner.js` the saved
    record and what follows from it; `policy.js` stars, up and down; `round.js` slots, misses, help;
    `gate.js` first-visit questions; `i18n.js`, `store.js`, `profiles.js`, `things.js`.
  - `ui/`: the screens (Home, map, station, round) and the shared parts (question box and voice, answer
    buttons, number pad, sounds).
- `public/boards/`: the reusable pictures a task is drawn with (`menge`, `vergleich`, `reihe` so far).
- `public/ideas/<id>/`: one idea: `idea.js` (ladder and recipes) and `lang/de.js`, `en.js`, `ne.js`; where a
  picture exists only there, its `board.js`; where tasks are picked from tables with rules, `tasks.js`.
  The Tal ideas other than *zahl* are think-lab's, ported with `engine/ui/ported.js` (their pictures are
  in `public/ported.css`). `ideas/index.js` lists the ideas that are written.
- `public/lang/`: shared words: numbers, praise, buttons, names of maps, stations and things.
- `public/art/<map>/`: the map's scene and the stations' backgrounds.

## Checks

```sh
node tools/check-graph.mjs    # the universe: references, reachability by age, ways back, layout vs nearness
node tools/check-ideas.mjs    # every idea: 1000 tasks per rung, perspective and kind of task
node tools/check-engine.mjs   # the learning rules: stars, up and down, rounds, first-visit questions
```

## To add a station

Write `public/ideas/<id>/idea.js` (ladder, its 1 to 5 perspectives, one recipe each) and its three language
files, add the id to `public/ideas/index.js`, and draw `public/art/<map>/<station>.svg`. The station's line
in `content/universe.js` is already there. No engine change.

Plain HTML, CSS and JavaScript. No libraries, no build step, no tracking. Served as static files by
Cloudflare (`wrangler.jsonc`). Nothing a child does leaves the device.
