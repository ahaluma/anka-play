# AnkaPlay

Small maths and thinking games for children from 3 to 12 („अङ्क“ / *anka* = number), in German, English
and Nepali. The new, generalised version of [think-lab](https://github.com/ahaluma/think-lab): one engine,
and everything else (maps, stations, paths, portals, rules, tasks, texts) is data.

**Status:** the engine runs, and three maps can be played on a phone. The Tal (the valley, ages 3 to 6):
twelve stations, eleven ideas in all five ways of playing each, and number memory at the tree stump. The
Fluss (the river, school): the number line and rounding at the footbridge, tens and ones and big numbers up to
a million in the flower field, shapes at the gravel bank, clock and calendar at the sunny rock, units at the mill,
area and plans in the garden, data and chance at the willow, buildings of cubes and nets at the boxes. The Feld
(the field edge, school): plus, minus, times and divide at the apple tree, the berries, the hen yard and the nut
tree, written sums in the barn, money with euros and cents at the farm stand, and stories at the clearing, with the learning box and the bridges of think-lab's market. The Berg (the mountain, 9 to 12): the
twelve camps of think-lab's Denk-Berg from the fence at the foot to the number wall, and the summit with its
competition rounds; camps come out of the fog as the ones below are mastered. For parents (the „Eltern“ button at the
bottom of Home): the children, each child's progress map by map and station by station, reading aloud, the switch
that opens the Berg before 9, a backup to a file and back, and the privacy policy at `/datenschutz/`. After the first
visit everything works without internet. The design is in [docs/DESIGN.md](docs/DESIGN.md); section 11 is the
order of work. Which primary-school skills were missing and how the new stations teach them is in
[docs/GRUNDSCHULE.md](docs/GRUNDSCHULE.md) (German).

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
    `gate.js` first-visit questions; `box.js` the learning box of the Feld; `i18n.js`, `store.js`, `profiles.js`, `things.js`.
  - `ui/`: the screens (Home, map, station, round) and the shared parts (question box and voice, answer
    buttons, number pad, sounds).
- `public/boards/`: the reusable pictures a task is drawn with (`menge`, `vergleich`, `reihe`, and
  `rechnung`: the sums of the Feld, with its task code, stories and sentences in `boards/rechnung/`; `berg/`: the
  parts every camp of the Berg shares, the summit's tool backpack and the keepsake picture).
- `public/ideas/<id>/`: one idea: `idea.js` (ladder and recipes) and `lang/de.js`, `en.js`, `ne.js`; where a
  picture exists only there, its `board.js`; where tasks are picked from tables with rules, `tasks.js`.
  The Tal ideas other than *zahl* are think-lab's, ported with `engine/ui/ported.js` (their pictures are
  in `public/ported.css`); so are the Fluss ideas and the money stand (`public/ported-schule.css`), and the Berg's camps (`public/ported-berg.css`). The four
  operations and the clearing share think-lab's market code in `boards/rechnung/`. `ideas/index.js` lists the ideas that are written.
- `public/offen/`: the open Tal, a first try (`#/offen/teich`, a button under the Tal map): the pond as one scene
  without stations. The owl (`owl.js`) picks what happens from small skills counted right and wrong
  (`skills.js`: sicher after 20 answers with 18 of the last 20 right; one star for every right answer).
  `node tools/check-offen.mjs` plays it with a simulated child. German only so far.
- `public/lang/`: shared words: numbers, praise, buttons, names of maps, stations and things.
- `public/art/<map>/`: the map's scene and the stations' backgrounds.
- `public/eltern/`: the parents' page (`#/eltern`), drawn from `engine/report.js`; the backup is `engine/backup.js`
  (only AnkaPlay's own `anka:` entries; a think-lab backup is recognised and refused).
- `public/info/`: the page for parents that explains every map and station, what a child learns there and why it is
  built this way (`/info/`, linked from the parents' page). Texts in `info/lang/de.js`; English and Nepali show a note
  until they are translated. `check-engine` checks that every station has its text.
- `public/datenschutz/`: the privacy policy (German binding, English, Nepali). **Before going public**, put the
  operator's name, postal address and e-mail in `public/datenschutz/contact.js`.
- `public/sw.js`: keeps a copy of every file on the phone (network first, so updates show at once). Its file list
  and version are written by `node tools/check-offline.mjs --write`. `manifest.webmanifest` and the icons make it
  installable on the home screen.

## Checks

```sh
node tools/check-graph.mjs    # the universe: references, reachability by age, ways back, layout vs nearness
node tools/check-ideas.mjs    # every idea: 1000 tasks per rung, perspective and kind of task
node tools/check-engine.mjs   # the learning rules, the parents' report, the backup
node tools/check-offen.mjs    # the open Tal's owl: skills open one after the other, "Wie viele?" gets rarer
node tools/check-offline.mjs  # sw.js lists every file (after changing any file: --write)
```

## Online with Cloudflare

`wrangler.jsonc` tells Cloudflare to serve `public/` as it is: no build, no code on the server, no logs.
`public/_headers` sets the security rules (only this site's own files may load) and keeps `sw.js` fresh.
Once, in the Cloudflare dashboard: **Workers & Pages → Create → Import a repository → anka-play**, build command
empty, deploy command `npx wrangler deploy`; under **Settings → Build** turn on builds for other branches (a preview
link for every pull request); for an own address, **Settings → Domains & Routes → Add custom domain**. Leave Web
Analytics off.

## To add a station

Write `public/ideas/<id>/idea.js` (ladder, its 1 to 5 perspectives, one recipe each) and its three language
files, add the id to `public/ideas/index.js`, and draw `public/art/<map>/<station>.svg`. The station's line
in `content/universe.js` is already there. No engine change.

Plain HTML, CSS and JavaScript. No libraries, no build step, no tracking. Served as static files by
Cloudflare (`wrangler.jsonc`). Nothing a child does leaves the device.
