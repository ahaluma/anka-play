# AnkaPlay

Small maths and thinking games for children from 3 to 12 („अङ्क“ / *anka* = number), in German, English
and Nepali. The new, generalised version of [think-lab](https://github.com/ahaluma/think-lab): one engine,
and everything else (maps, stations, paths, portals, rules, tasks, texts) is data.

**Status: design.** Read [docs/DESIGN.md](docs/DESIGN.md). No game is ported yet.

What is already here and runs:

- `public/content/universe.js`: the whole universe as data: 4 maps, 35 stations, paths, portals, gates,
  nearness, Home.
- `public/engine/graph.js`: conditions, open, visible, reachable, nearness, suggestions.
- `public/engine/recipe.js` and `public/ideas/zahl/idea.js`: tasks made from data, one complete idea.
- Checks, with Node 22 or newer (no npm needed):

```sh
node tools/check-graph.mjs   # the universe: references, reachability by age, ways back, layout vs nearness
node tools/check-ideas.mjs   # every idea written as data: 1000 tasks per rung and perspective
```

Plain HTML, CSS and JavaScript. No libraries, no build step, no tracking. Served as static files by
Cloudflare (`wrangler.jsonc`).
