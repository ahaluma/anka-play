// Makes tasks from recipes: plain data that says which numbers to draw, which rules they must keep,
// what the board shows and what the right answer is. No eval (the site's CSP forbids it): expressions
// are small JSON lists, ["+", "$a", "$b"]. See docs/DESIGN.md, section 6.
//
// A recipe:
//   vars   { name: generator }, drawn in order. Generators:
//            ["int", from, to]        a whole number, both ends included
//            ["oneOf", [x, y, …]]     one of the values
//            ["chance", p]            true with probability p (0.3 = three in ten)
//            ["shuffled", list]       the list in a new order (never the same order, if it has 2 or more)
//            ["sample", list, n]      n different values of the list
//            ["thing"]                one of the things to count (shared list, engine/things.js)
//            any expression           computed from what was drawn before
//   where  [expression, …]            all must be true, else draw again (at most 500 times)
//   show   the board's fields (content/boards.js), with "$name" or expressions as values
//   answer { mode, value, options?, fix? }  options default: the right value and two near numbers
//   ask    the text key of the task (ideas/<id>/lang/<language>.js); every var is passed to its sentences
//   key    the vars that tell two tasks apart (no repeat of the last few)
//
// A perspective can have one recipe, or several kinds of task: { variants: [recipe, …] }. Each variant
// may have a `weight` (default 1) and a `when` (only at rungs where it holds), both expressions over the
// rung's params: { weight: ["if", [">", "$max", 5], 3, 2], when: [">", "$max", 5], … }.

const OPS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => Math.floor(a / b),
  "%": (a, b) => a % b,
  min: Math.min,
  max: Math.max,
  abs: Math.abs,
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  and: (...x) => x.every(Boolean),
  or: (...x) => x.some(Boolean),
  not: (a) => !a,
  if: (c, a, b) => (c ? a : b),
  cmp: (a, b) => (a > b ? "more" : a < b ? "fewer" : "same"),
  range: (a, b, step = 1) => Array.from({ length: Math.max(0, Math.floor((b - a) / step) + 1) }, (_, i) => a + i * step),
  len: (list) => list.length,
  at: (list, i) => list[i],
  sorted: (list) => [...list].sort((x, y) => x - y),
  has: (list, x) => list.includes(x),
};

/** Is this list an expression? ["+", …] is; [1, 2, 3] and ["more", "fewer"] are plain lists. */
const isExpr = (x) => Array.isArray(x) && typeof x[0] === "string" && x[0] in OPS;

/** Evaluate a value: "$name" looks up, [op, …args] computes, objects and plain values pass through. */
export function value(x, env) {
  if (typeof x === "string" && x.startsWith("$")) {
    const name = x.slice(1);
    if (!(name in env)) throw new Error(`unknown name ${x}`);
    return env[name];
  }
  if (isExpr(x)) {
    // "if" evaluates only the branch it takes, so a branch may use a name that the other one does not have
    if (x[0] === "if") return value(value(x[1], env) ? x[2] : x[3], env);
    return OPS[x[0]](...x.slice(1).map((a) => value(a, env)));
  }
  if (Array.isArray(x)) return x.map((a) => value(a, env));
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, value(v, env)]));
  return x;
}

function shuffled(list, r) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GENERATORS = {
  int: ([lo, hi], env, r) => {
    const [a, b] = [value(lo, env), value(hi, env)];
    return a + Math.floor(r() * (b - a + 1));
  },
  oneOf: ([list], env, r) => {
    const l = value(list, env);
    return l[Math.floor(r() * l.length)];
  },
  chance: ([p], env, r) => r() < value(p, env),
  shuffled: ([list], env, r) => {
    const l = value(list, env);
    let s = shuffled(l, r);
    if (l.length > 1 && s.every((x, i) => x === l[i])) s = [...s.slice(1), s[0]];
    return s;
  },
  sample: ([list, n], env, r) => shuffled(value(list, env), r).slice(0, value(n, env)),
  thing: (_, env, r) => env.things[Math.floor(r() * env.things.length)],
};

function draw(gen, env, r) {
  if (Array.isArray(gen) && gen[0] in GENERATORS) return GENERATORS[gen[0]](gen.slice(1), env, r);
  return value(gen, env);
}

function nearOptions(right, env, r, lo = 0) {
  if (typeof right !== "number") return null;
  const pool = [right - 2, right - 1, right + 1, right + 2].filter((x) => x >= lo && x <= (env.max ?? Infinity) + 2);
  const pick = [];
  while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return [right, ...pick].sort((a, b) => a - b);
}

/** The recipes a perspective has at a rung: one, or the variants whose `when` holds. */
export function variants(recipe, params) {
  if (!recipe?.variants) return [recipe];
  return recipe.variants.filter((v) => v.when === undefined || value(v.when, params));
}

/** Pick one variant by weight. */
function choose(recipe, params, r) {
  const list = variants(recipe, params);
  if (list.length === 1) return list[0];
  const weights = list.map((v) => Math.max(0, value(v.weight ?? 1, params)));
  let x = r() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) if ((x -= weights[i]) < 0) return list[i];
  return list.at(-1);
}

/**
 * One task from a recipe at a level. `params` are the level's params (e.g. { max: 10 }); `r` is a random
 * function (seeded in tests); `recent` holds the keys of the last tasks, which are not repeated.
 * Returns { board, show, answer, ask, vars, key }: plain data, the same shape a tasks.js returns.
 */
export function make(recipe, params, { r = Math.random, things = ["ladybird"], recent = [] } = {}) {
  const rec = choose(recipe, params, r);
  for (let i = 0; i < 500; i++) {
    const env = { ...params, things };
    for (const [name, gen] of Object.entries(rec.vars ?? {})) env[name] = draw(gen, env, r);
    if (!(rec.where ?? []).every((w) => value(w, env))) continue;
    const key = `${rec.ask}:${(rec.key ?? Object.keys(rec.vars ?? {})).map((k) => JSON.stringify(env[k])).join(",")}`;
    if (recent.includes(key) && i < 400) continue;
    const answer = value(rec.answer, env);
    if (answer.options === undefined) answer.options = nearOptions(answer.value, env, r);
    const vars = Object.fromEntries(Object.keys(rec.vars ?? {}).map((k) => [k, env[k]]));
    return { board: rec.board, show: value(rec.show ?? {}, env), answer, ask: rec.ask, vars: { ...params, ...vars }, key };
  }
  throw new Error(`recipe ${rec.ask}: no task keeps its rules at ${JSON.stringify(params)}`);
}

/** The `r` a think-lab task generator expects: r.int, r.pick, r.shuffle, r.sample, r.chance. */
function rng(r) {
  return {
    int: (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)),
    pick: (list) => list[Math.floor(r() * list.length)],
    shuffle: (list) => shuffled(list, r),
    sample: (list, n) => shuffled(list, r).slice(0, n),
    chance: (p) => r() < p,
  };
}

/**
 * One task of an idea in a perspective at a level: from its recipe, or (where a generator must search or
 * filter tables, docs/DESIGN.md 6.5) from its code: `tasks: { make(level, r), check(task, level) }` in idea.js,
 * think-lab's task(level, r) with level = { p, ...params }. Both give the same shape.
 */
export function taskOf(def, p, params, { r = Math.random, things, recent = [] } = {}) {
  if (def.recipes?.[p]) return make(def.recipes[p], params, { r, things, recent });
  if (!def.tasks) throw new Error(`${def.id}: no recipe and no task code for ${p}`);
  const R = rng(r);
  for (let i = 0; ; i++) {
    const t = def.tasks.make({ p, ...params }, R);
    const key = `${def.id}.${p}:${t.key ?? JSON.stringify(t)}`;
    if (recent.includes(key) && i < 40) continue;
    return { board: def.board, show: {}, answer: { mode: "own", value: null, options: null }, ask: `${def.id}.${p}`, vars: { ...params, ...t, p }, key };
  }
}
