# AnkaPlay

Small maths and thinking games for children from 3 to 12 („अङ्क“ / *anka* = number), in German, English
and Nepali.

**Status: Neubau.** AnkaPlay is being rebuilt from the ground up, step by step. The first place is the pond
(„Teich“): frogs on two lily pads, an owl that asks what the child is ready for, a simulated world behind it.
The old game (maps, stations, Berg, Eltern area) is kept in the git history at commit `5bad194`.

## Try it

```sh
node tools/serve.mjs        # then open http://localhost:8080 (Node 22 or newer, nothing to install)
```

## What is where

- `public/index.html`, `public/app.css`: the one page. Routes after `#`, see `engine/router.js`.
- `public/engine/`: what every place shares: who plays (`profiles.js`), languages (`i18n.js`, texts in
  `public/lang/`), the saved data on this device (`store.js`), and the screen parts in `ui/` (top bar, voice,
  sounds, buttons).
- `public/offen/`: the pond. `teich.js` the screen, `world.js` the simulated frogs, `questions.js` the
  question catalogue, `skills.js` what a child can, `owl.js` which question comes next, `runs.js`, `figures.js`.
- `public/datenschutz/`: the privacy policy.
- `public/sw.js`: offline after the first visit.

## Checks (Node 22 or newer)

```sh
node tools/check-offen.mjs     # the pond: simulated children, the owl's choices, the texts
node tools/check-offline.mjs   # sw.js lists every file (after a change: --write)
```

## Deploy

Plain HTML, CSS and JavaScript. No libraries, no build step, no tracking. Served as static files by the
Cloudflare Worker `anka-play` (`wrangler.jsonc`); every branch gets a preview link.
