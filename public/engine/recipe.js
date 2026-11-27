// Makes tasks from recipes: plain data that says which numbers to draw, which rules they must keep,
// what the board shows and what the right answer is. No eval (the site's CSP forbids it): expressions
// are small JSON lists, ["+", "$a", "$b"]. See docs/DESIGN.md, section 6.
//
// A recipe:
//   vars   { name: generator }, drawn in order. Generators:
//            ["int", from, to]        a whole number, both ends included
//            ["oneOf", [x, y, …]]     one of the values
//            ["thing"]                one of the things to count (shared list, engine/things.js)
//            any expression           computed from what was drawn before
//   where  [expression, …]            all must be true, else draw again (at most 500 times)
//   show   the board's fields (content/boards.js), with "$name" or expressions as values
//   answer { mode, value, options? }  options default: the right value and two near numbers
//   ask    the text key of the question (lang/<language>.js); every var is passed to it
//   key    the vars that tell two tasks apart (no repeat of the last few)

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
  range: (a, b, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step),
};

/** Evaluate a value: "$name" looks up, [op, …args] computes, objects and plain values pass through. */
export function value(x, env) {
  if (typeof x === "string" && x.startsWith("$")) {
    const name = x.slice(1);
    if (!(name in env)) throw new Error(`unknown name ${x}`);
    return env[name];
  }
  if (Array.isArray(x) && typeof x[0] === "string" && x[0] in OPS) return OPS[x[0]](...x.slice(1).map((a) => value(a, env)));
  if (Array.isArray(x)) return x.map((a) => value(a, env));
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, value(v, env)]));
  return x;
}

function draw(gen, env, r) {
  if (Array.isArray(gen) && gen[0] === "int") {
    const [lo, hi] = [value(gen[1], env), value(gen[2], env)];
    return lo + Math.floor(r() * (hi - lo + 1));
  }
  if (Array.isArray(gen) && gen[0] === "oneOf") {
    const list = value(gen[1], env);
    return list[Math.floor(r() * list.length)];
  }
  if (Array.isArray(gen) && gen[0] === "thing") return env.things[Math.floor(r() * env.things.length)];
  return value(gen, env);
}

function nearOptions(right, env, r, lo = 0) {
  if (typeof right !== "number") return null;
  const pool = [right - 2, right - 1, right + 1, right + 2].filter((x) => x >= lo && x <= (env.max ?? Infinity) + 2);
  const pick = [];
  while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  return [right, ...pick].sort((a, b) => a - b);
}

/**
 * One task from a recipe at a level. `params` are the level's params (e.g. { max: 10 }); `r` is a random
 * function (seeded in tests); `recent` holds the keys of the last tasks, which are not repeated.
 */
export function make(recipe, params, { r = Math.random, things = ["🐞"], recent = [] } = {}) {
  for (let i = 0; i < 500; i++) {
    const env = { ...params, things };
    for (const [name, gen] of Object.entries(recipe.vars ?? {})) env[name] = draw(gen, env, r);
    if (!(recipe.where ?? []).every((w) => value(w, env))) continue;
    const key = (recipe.key ?? Object.keys(recipe.vars ?? {})).map((k) => env[k]).join(",");
    if (recent.includes(key) && i < 400) continue;
    const answer = value(recipe.answer, env);
    if (answer.options === undefined) answer.options = nearOptions(answer.value, env, r);
    const vars = Object.fromEntries(Object.keys(recipe.vars ?? {}).map((k) => [k, env[k]]));
    return { board: recipe.board, show: value(recipe.show ?? {}, env), answer, ask: recipe.ask, vars, key };
  }
  throw new Error(`recipe ${recipe.ask}: no task keeps its rules at ${JSON.stringify(params)}`);
}
