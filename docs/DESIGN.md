# AnkaPlay: the design

AnkaPlay is the new, generalised version of the children's maths games in `ahaluma/think-lab`. It is a new
project at a new web address. This document is the whole design. It is written to be reviewed before any
game is ported. Where something is still your decision, it says so and gives a recommendation
(section 12).

The design is also in the repository as data that runs: `public/content/universe.js` is the whole
universe, and `node tools/check-graph.mjs` checks it. `public/ideas/zahl/idea.js` is one complete idea
written only as data, and `node tools/check-ideas.mjs` makes 10,000 tasks from it and checks them.

## 1. In short

- **One engine, everything else is data.** Maps, stations, paths, portals, conditions, gates, the
  perspectives, the rules for moving up and down, the tasks and the texts are data. The engine is one set
  of JavaScript modules that reads them. Adding a station is adding data; code is the exception
  (section 6 says exactly where).
- **The universe** is all maps together plus Home. Every map is a simple natural scene with a few
  memorable landmarks. Four maps: **Tal** (valley, preschool, 3 to 6), **Fluss** (river, school: numbers,
  space, time), **Feld** (field edge, school: calculation), **Berg** (mountain, olympiad, 9 to 12).
- **A station teaches one idea in 1 to 5 perspectives,** as many as its idea needs, and has its own
  background. A concept usually has all five; a station that is just a game (number memory) has one, is
  always open and counts as mastered from the start. 35 stations.
- **A graph** connects stations: paths inside a map, portals between maps, Home from everywhere. Every
  connection has a direction, a condition and a nearness. Related stations sit near each other on the map.
- **A portal can ask a few questions** on the first visit to its station. It always lets the child in; the
  answers only choose where the child starts.
- **Clean start:** new storage, no link to think-lab's saved progress.

## 2. What carries over from think-lab

These are standing decisions. They hold everywhere and are therefore rules of the engine, not settings.

| Rule | Where it lives |
| --- | --- |
| Preschool concept learning and school calculation are never mixed | `band` of each map; suggestions and review tasks never cross bands |
| A perspective is mastered with 4 of 5 tasks right at the first try in one round; it gets a visible star at once, no waiting days | `engine/learner.js` (one rule for all) |
| From the range up to 20, answers are typed on the number pad, not chosen | `BANDS` in `universe.js` and the recipe's `answer.mode` |
| Tasks whose numbers are all ≤ 20 are read aloud; taps are locked until the voice ends (at most 10 s) | `ui/question.js`, `ui/voice.js` |
| The whole question stays visible until the next task | `ui/question.js` |
| No "how was it?" question for children (the mountain loses it too) | not a field anywhere |
| Difficulty eases by itself: 3 wrong in a row → an easier task; 2 weak rounds → one group down | `content/policies.js` |
| No points, no clock, no streaks; mistakes explain, they do not punish | boards, texts |
| German, English, Nepali; Devanagari digits in Nepali; a Hindi voice as fallback | `engine/i18n.js` |
| Plain HTML, CSS, JavaScript; no build, no npm, no libraries, no tracking; static files on Cloudflare | the whole repo |
| From the thing to the picture to the number; help that fades; rows of five | the boards |

## 3. Words

| Word | Meaning |
| --- | --- |
| **Universe** | All maps, all stations, all connections, and Home. One per app (`content/universe.js`). |
| **Map** | One simple natural scene with 3 to 5 landmarks. Belongs to one band, names one policy. |
| **Landmark** | A simple, memorable object on a map (the big tree, the stream, the bridge). Stations sit by landmarks, so a child can say "the burrow by the big tree". |
| **Band** | Who a map is for: `vorschule` (3–6), `schule` (6–10), `olympiade` (9–12). Never mixed. |
| **Station** | One place on a map. One idea, 1 to 5 perspectives, its own background picture. |
| **Idea** | What a station teaches. A folder `ideas/<id>/` with its ladder, recipes and texts. |
| **Perspective** | A way into an idea: see, make, explore, use, check; or play, for a station that is only a game. A station has 1 to 5 of them. |
| **Ladder, rung, group** | The idea's levels, easy to hard. A rung has a fixed id. Rungs form groups (a number range, or "level 2"). Stars are counted per group. |
| **Edge** | A directed connection between two stations: `path` (same map), `portal` (other map), `relation` (only nearness, never walked). Home edges are added by the engine. |
| **Condition** | When an edge or a station's door is open: age, mastered stations, a star, a flag, a parents' switch, combined with all / any / not. |
| **Nearness** | 0 to 1, how closely two ideas are related. |
| **Gate** | Questions a portal asks on the first visit to its target station. Never blocks. |
| **Policy** | How a child moves on a ladder: when up, when down, which help, which round slots. |
| **Recipe** | Data that makes the tasks of one perspective: which numbers, which rules, which board, which answer. |
| **Board** | One of 16 reusable pictures a task is drawn with (a set of things, a number line, a clock …). |

## 4. The universe

### 4.1 The maps

All four maps are natural scenes. What were the town's buildings (station, flower shop, workshop, weather
station) and the market's stands are now places in nature with the same ideas.

| Map | Band | Scene and landmarks | Stations (idea) | Shown on the map from the start |
| --- | --- | --- | --- | --- |
| **Tal** | Vorschule 3–6 | A valley: stream, big tree, pond, hill, cloud | wiese (zahl), baumstumpf (memory: number memory, one perspective), bau (teile), teich (zehn), obstbaum (gruppen), wald (muster), himmel (folge), nester (sortieren), pfuetze (schauen), huegel (lage), kiesel (form), ufer (groesse) | wiese, baumstumpf, bau, obstbaum, wald, huegel, himmel |
| **Fluss** | Schule 6–10 | A river: river, footbridge, willow, gravel bank, big rock | steg (reihe: the bridge's planks are the number line), blumenfeld (stellen), kiesbank (formen: mirror in the water, ruler), sonnenfels (zeit: sundial, weather, charts) | all four |
| **Feld** | Schule 6–10 | A field edge: orchard, hen yard, clearing, field path | apfelbaum (plus), beeren (minus), huehner (mal: eggs in rows), nussbaum (geteilt), lichtung (platz: stories, mixed), hofstand (geld: a farm stand) | all six; lichtung is drawn locked until plus and minus up to 10 have their flag |
| **Berg** | Olympiade 9–12 | A mountain: foot, waterfall, summit | the 12 camps of think-lab (zaun … mauer) and gipfel | zaun; the others come out of the fog as their paths open |

Station ids are new; idea ids are think-lab's, so each idea's content can be ported one to one. The
burrow (two ideas), hill and lake (three) and the sky (three) are split: **one idea per station**.

### 4.2 Visible, open, reachable

Three separate questions, each answered by `engine/graph.js` from the child's facts:

- **Visible:** a station is drawn when it is in the map's `shows`, or the child has been there, or an
  open path from a drawn station leads to it ("the fog lifts when the way opens"). No per-station
  visibility settings are needed.
- **Open:** a station's door is `always` open or has a condition (only lichtung today). A pure game
  station (`game: true`) is always open, and every way into it is always open; the checker enforces it. A child can stand
  in front of a closed door and see what opens it.
- **Reachable:** a walk from Home along open edges, stopping at closed doors.

`check-graph` proves on every change: a 3-year-old with nothing played reaches all 12 Tal stations and no
school station; a 6-year-old reaches 19; every station is reachable for a child who has mastered
everything; every locked way up has an always-open way back.

### 4.3 Home

Home is a node of the graph. The engine adds an always-open edge from every station to Home, so no map
can forget it and no condition can block it; every screen has the Home button. Home shows who plays, and
then one door per map the child may open (`HOME_DOORS`): the Tal always, Fluss and Feld from 6 or once
the child has crossed into them, Berg from 9, by the parents' switch, or once reached.

### 4.4 Portals and gates

| Portal | Condition | Gate on the first visit |
| --- | --- | --- |
| wiese → steg (stepping stones over the stream) | age 6, **or** wiese and teich mastered | three "where is it on the bridge?" tasks at 20, 100, 1000 |
| steg → apfelbaum (the bridge to the field) | always | three plus tasks of rising difficulty (3 + 6, 8 + 5, 23 + 40) |
| sonnenfels → zaun (the mountain path) | age 9, **or** the parents' switch "berg" | three fence tasks at levels 1, 2, 3 |
| every way back | always | none |

A gate is **the first-visit questions of its target station**: they are asked once, whichever way the
child comes in first (also straight from the map). The gate never blocks. The highest rung answered right
at the first try becomes the starting rung; with none right the child starts on the first rung. The
station welcomes the child either way, and the result is saved, so the parents' page can say "started at
20 after the door questions". Any station can get first-visit questions by giving any edge into it a
`gate`; stations without one start by age (`start.byAge` of the idea).

## 5. The graph in detail

### 5.1 Edges and conditions

```js
{ from: "wiese", to: "steg", kind: "portal", nearness: 0.7, icon: "stepping-stones",
  requires: { any: [{ age: 6 }, { mastered: ["wiese", "teich"] }] },
  gate: { perspective: "sehen", levels: ["20", "100", "1000"] } }
```

Condition types: `age`, `mastered` (stations), `perspective` (one star), `flag` (a whole group of a
station's ladder), `rounds`, `visited`, `reached` (a map), `parent` (a switch on the parents' page), and
`all` / `any` / `not`. One checker per type in `CONDITIONS`; a new type is one new line.

**Mastered** (for conditions): every perspective the station has (1 to 5) has its star in the idea's
mastery group (default: its highest group). **Flag**: every perspective of the station starred in one named
group. A pure game station counts as mastered from the start, so it never blocks anything that depends on it.
Conditions never count stars as a number, so they mean the same for a station with one perspective
and one with five.

### 5.2 Nearness

Every connection carries a nearness; pairs without a path get a `relation` edge with only a nearness (for
example wiese and steg: how many / where on the line). Nearness is used three ways:

1. **Layout (decided).** Related stations sit near each other. `check-graph` warns when two stations on
   one map with nearness ≥ 0.7 are more than 250 apart (of 1000), or ≥ 0.5 more than 400 apart.
   Counting (wiese) sits between the parts (bau, 0.8) and the sizes (ufer, 0.5).
2. **The next suggestion (proposed).** After a round, the station screen points at the nearest reachable
   station that is not mastered yet (`suggest()`). A suggestion, never a lock.
3. **Review tasks (proposed).** One task per round from a near station the child has already mastered,
   same band only. This generalises the mountain's backpack and the market's review slot.

Relations that cross bands (Tal to Fluss/Feld) are shown to parents ("counting leads to the number line")
and never used to mix tasks.

## 6. Maximum generalisation

### 6.1 What is data

| Thing | File | Was in think-lab |
| --- | --- | --- |
| Maps, stations, landmarks, paths, portals, nearness, gates, Home doors | `content/universe.js` | `PLACES`, `TOWN`, `MOUNTAIN`, `needs`, special code in each map page |
| Perspectives and thinking cards | `content/perspectives.js`; names per map in `lang/` | `frame/ideas.js` and `berg.perspectives` |
| Policies (up, down, help ladder, slots, learning box, flags) | `content/policies.js` | three engines: `record.js`, `markt/record.js`, `adapt.js` |
| Ladders, start rules, thinking cards per idea | `ideas/<id>/idea.js` | `IDEAS`, `STEPS`, `levels.js` |
| **Tasks** | recipes in `ideas/<id>/idea.js` | `tasks.js` code per idea |
| **What a task looks like** | a board name and its fields, in the recipe | `boards.js` code per idea |
| Mistake kinds | shared list in `content/boards.js`, plus an idea's own | only the market knew them |
| Texts | `ideas/<id>/lang/<language>.js`, `lang/<language>.js` | the same (kept) |

### 6.2 Recipes: tasks as data

A recipe draws numbers, keeps rules, fills a board and names the right answer. Expressions are small JSON
lists, because the site's security policy forbids `eval`:

```js
anwenden: {                                   // zahl, use: more, fewer or the same
  board: "vergleich",
  vars: { a: ["int", 1, "$max"], b: ["int", 1, "$max"], thing: ["thing"], rel: ["cmp", "$a", "$b"] },
  where: [["<=", ["abs", ["-", "$a", "$b"]], 3]],
  show: { left: { things: "$thing", n: "$a" }, right: { things: "$thing", n: "$b" }, ask: "more" },
  answer: { mode: "choose", value: "$rel", options: ["more", "same", "fewer"] },
  ask: "zahl.anwenden",
  key: ["a", "b"],
}
```

The engine (`engine/recipe.js`, about 90 lines) draws, retries until the rules hold, avoids repeats, adds the
two near wrong options, and hands the board plain data. `$max` comes from the rung's params, so the same
recipe serves every rung. The mistake of a wrong answer is also an expression (`oneOff` when
`|given − right| = 1`), so every station, not only the market, knows its typical mistakes. `zahl` is
written completely this way, and `check-ideas` makes and checks 10,000 of its tasks.

### 6.3 Boards: 16 reusable pictures

| Board | Draws | Used by (examples) |
| --- | --- | --- |
| `menge` | a set of things: rows of five, ten-frame, scattered, groups, flashed | zahl, teile, zehn, gruppen, mal, geteilt |
| `vergleich` | two sets side by side | zahl, minus as difference |
| `teile` | a whole and its parts, one hidden | teile, zehn |
| `reihe` | a number line: stones, bridge planks, ruler | zahl, reihe, formen (ruler), zaun |
| `stellen` | bundles: flowers, sticks, notes | stellen, geld |
| `rechnung` | a sum with a gap, with or without a picture | plus, minus, mal, geteilt |
| `folge` | a row of pictures | muster, folge, ameisen |
| `koerbe` | baskets to sort into | sortieren, tanz |
| `bild` | a small scene with objects in relations | lage, schauen |
| `formen` | shapes and solids, mirror, ruler | form, formen, fels |
| `uhr` | the clock | zeit |
| `geld` | coins and notes, a price, a wallet | geld |
| `waage` | a balance | groesse, waage |
| `tabelle` | tables and charts | zeit, haken |
| `raster` | a grid: ways, boards, colouring | haken, schauen, socken |
| `text` | a word problem with one picture | platz, the mountain |

Every board takes the same extras: `hide` (cover part of it after a moment), `owl` (the owl claims
something, the child checks: the whole "check" perspective in one place), `story` (steps shown one after
the other). Seven answer modes: `choose`, `type`, `tapThings`, `build`, `order`, `place`, `yesNo`.

### 6.4 Perspectives per idea

An idea lists its perspectives, 1 to 5, in the fixed order (`perspectives` in `idea.js`), and has one recipe
for each. `zahl` has all five. A station that is only a game has the one perspective `spielen` 🎲, which
stands alone. A game has no stars to earn: its station is marked `game: true` in `universe.js`, is always
open and is mastered from the start. `check-ideas` refuses an idea with none, more than five, a wrong order, `spielen` mixed with
others, or a recipe for a perspective it does not list.

### 6.5 Where the line is, and why

Generalisation stops in three places, on purpose:

1. **Generators that must search.** The mountain's logic puzzles (huetten, mauer) need a solver to prove
   exactly one solution; counting camps (haken, socken) enumerate. An expression language that can do
   that is a worse programming language. Such an idea keeps a small `ideas/<id>/tasks.js` with
   `task(level, perspective, r)` that returns **the same task shape** as a recipe, so the rest of the
   engine cannot tell the difference. My estimate: the 11 Tal concept ideas, the 4 Fluss ideas and the 6 Feld
   ideas fit recipes; about half of the 13 Berg ideas need code.
2. **Pictures that exist once.** A cube net folding, the sundial. A board is generic when a third idea
   needs it; the first two uses may be a bespoke board in `ideas/<id>/board.js` with the same interface
   (`draw(host, task, ctx)` returning `{ hint, help, way }`).
3. **Grammar.** Sentences stay small functions per language (`ein Apfel`, `zwei Äpfel`, Nepali
   classifiers). A template language for three grammars costs more than it saves.

## 7. Learning and progress

### 7.1 A round

A round is 5 tasks of one station in one perspective (3 for children under 5 in the Tal). Its slots come
from the policy: `cur` (the child's rung), `easier` (after 3 wrong in a row), `review` (a near mastered
station, proposed), `inverse` and `bridge` (Feld), `backpack` (Berg), `surprise` (another perspective
already played, not counted; only at stations with two or more perspectives). The help ladder comes from the policy: hint after 2 misses, then picture,
then the way in small steps.

### 7.2 Stars, groups, moving

- **Star:** 4 of 5 right at the first try in one round of a perspective, in the current group. At once.
- **Up:** 60 % of the station's perspectives starred in a group → the next group (Tal, Fluss, Berg): 3 of 5,
  3 of 4, 2 of 3, 2 of 2, 1 of 1. In the Feld one good
  round moves one rung (its sub-steps), as the market does today.
- **Down:** 2 weak rounds in a row (2 of 5 or fewer) → one group down, and the age catch-up stops.
- **Flag:** all the station's perspectives starred in a group. A flag on a higher group fills the lower ones (Feld).
- **Mastered station:** all the station's perspectives starred in the mastery group. This is what
  conditions read. zahl needs five stars; a pure game like number memory needs none, it is mastered from
  the start.

### 7.3 Policies

| | Tal | Fluss | Feld | Berg |
| --- | --- | --- | --- | --- |
| step up | group, 60 % of stars | group, 60 % of stars | rung, good round | group, 60 % of stars |
| step down | 2 weak in a row | 2 weak in a row | 2 weak in a row | 2 weak in a row |
| help ladder | hint | hint, picture | hint, picture, way | hint, way |
| slots | cur, surprise | cur, surprise | cur ×3, review, inverse | cur ×4, backpack |
| learning box | no | no | yes | no |

Because these are fields, giving the Fluss the learning box or the Tal the help ladder is a one-line change.

## 8. Storage

New address, new storage, no compatibility with think-lab. Keys:

- `anka:profiles`: the children on this device (name, age with the day it was entered, animal, settings).
- `anka:learner:<child>`: one record per child, `v: 1`:

```js
{ v: 1, kid: "k1",
  stations: { wiese: { level: "10", lowered: false, weakInRow: 0, rounds: 12, visited: "2026-11-27",
                       gate: { day: "2026-11-27", answers: [...], start: "10" },
                       cells: { "sehen@10": { n: 10, first: 8, recent: [1,1,0,1,1], star: "2026-11-27" } },
                       mistakes: [{ kind: "oneOff", round: 12 }] } },
  cards: { "plus:8,5": { box: 3, seen: "2026-11-27" } },   // learning box (Feld)
  daily: { "2026-11-27": { right: 14, wrong: 3, rounds: 3 } },
  thinkingCards: { vergleichen: 4 }, parent: { berg: false } }
```

Only facts are saved. Stars, mastered, open, visible, reachable and suggestions are computed, so a rule
can change later without migrating anyone. Rungs are saved by id, never by index. The parents' page has a
backup to a file and back. Importing think-lab's backup is not planned (section 12).

## 9. The engine and the pages

One page (`public/index.html`) with routes after `#`. Static files, works offline through a service worker.

| Route | Screen |
| --- | --- |
| `#/` | Home: who plays, then the map doors |
| `#/map/tal` | a map: scene, landmarks, visible stations, portals, Home |
| `#/s/wiese` | a station: its background, its 1 to 5 perspectives with stars, its paths and portals, the suggestion |
| `#/s/wiese/sehen` | a round |
| `#/gate/wiese>steg` | the first-visit questions (only when they are due) |
| `#/eltern` | parents: children, progress per map and station, switches, backup |
| `/datenschutz/` | privacy policy (a separate static page) |

```
public/
├── index.html, app.css          ← the one page
├── content/                     ← DATA: the universe and the rules
│   ├── universe.js              ← maps, stations, edges, gates, Home doors, bands
│   ├── perspectives.js          ← the perspectives, the 1-to-5 rule, thinking cards
│   ├── policies.js              ← how children move, per map
│   └── boards.js                ← the board catalogue, answer modes, shared mistake kinds
├── engine/                      ← CODE, the same for everything
│   ├── graph.js                 ← conditions, open, visible, reachable, nearness, suggest
│   ├── recipe.js                ← tasks from recipes
│   ├── round.js                 ← slots, attempts, help ladder, the end of a round
│   ├── policy.js                ← up, down, star, flag, learning box
│   ├── learner.js               ← the saved record and what is computed from it
│   ├── gate.js                  ← first-visit questions -> starting rung
│   ├── router.js                ← the routes above
│   ├── i18n.js, store.js, profiles.js, things.js
│   └── ui/                      ← question box, voice, number pad, owl, help, done screen
├── boards/<board>.js            ← the 16 boards
├── ideas/<idea>/
│   ├── idea.js                  ← ladder, start, recipes (DATA)
│   ├── tasks.js                 ← only where a generator must search (section 6.5)
│   ├── board.js                 ← only for a picture that exists once
│   └── lang/de.js, en.js, ne.js
├── art/<map>/                   ← scene.svg, landmarks, one background per station
├── lang/de.js, en.js, ne.js     ← shared words, map and station names, perspective names per map
├── eltern/, datenschutz/
└── sw.js, manifest.webmanifest, icons
tools/check-graph.mjs, check-ideas.mjs
```

**To add a station:** write `ideas/<id>/idea.js` (ladder, its 1 to 5 perspectives, one recipe each), its three language files and
a background picture, and add one station line and its edges to `universe.js`. No engine change.
**To add a map:** one entry in `MAPS`, a scene picture, its stations, a portal and a Home door.

## 10. Art

Every map is one SVG scene in calm colours with 3 to 5 landmarks drawn big and simple. Each station gets
its own background (the meadow, the burrow inside, the bridge from the side) behind every board of that
station. Things to count come from one shared set (think-lab's 34 animals and things), so they look the
same everywhere. Pictures are true to the world (the tree above, the grass below) and work in Germany and
in Nepal.

## 11. After you agree: the order of work

1. Engine core: graph (done here), recipe (done here), learner, policy, round, router, question and voice.
2. The Tal map with wiese (zahl, already written as data) end to end, on the phone.
3. The other 10 Tal stations, ported from think-lab's ideas into recipes and boards.
4. Fluss and Feld; the Feld policy (learning box, bridges).
5. Berg: recipes where they fit, `tasks.js` for the camps that need a solver.
6. Parents' page, backup, privacy page, service worker, Cloudflare.

## 12. Decisions for you

1. **Number ranges: levels or stations?** Recommended: **levels inside one idea** (rungs and groups of one
   ladder, as drafted). One station per idea keeps the map small and memorable; the gate and the policy
   already move the child between ranges; separate stations per range would triple the Feld map. The
   preschool/school split is kept by the ideas themselves (zahl up to 10 in the Tal, reihe and stellen
   from 20 in the Fluss), not by ranges.
2. **The perspectives: the same everywhere, or per map?** Decided: a station has 1 to 5, as its idea
   needs. Recommended for the rest: **the same ids, icons,
   order and star rule everywhere; names per map** (the mountain says understand, try out, find the rule,
   transfer, explain why). One record shape, one parents' page, and the mountain keeps its voice.
3. **Nearness for the next suggestion and for review tasks?** Recommended: **yes, both, same band only;**
   review takes one task per round, only from stations already mastered.
4. **One idea per station:** this design splits the burrow, hill and lake, and the sky. Please confirm.
5. **Map names and cut:** Tal, Fluss, Feld, Berg. Fluss and Feld could also be one map; I kept two because
   ten stations on one phone screen are too many.
6. **The mountain loses "how was it?"** (the standing rule for children). Please confirm.
7. **Zahlen-Memory:** decided: its own station, baumstumpf, next to the wiese, a pure game with one
   perspective (play), always open and mastered from the start. Ported with the Tal.
8. **The mountain portal:** from 9, or earlier by the parents' switch.
9. **Import from think-lab's backup:** not at launch; think-lab stays online.
10. **The repository is empty** (no `main` yet), so this design is on its own branch. Say if it should
    become the first commit of `main`.
