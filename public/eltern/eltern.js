// For parents (#/eltern): the children on this device, and the report of one child map by map and station by
// station (engine/report.js), the switches (reading aloud, the Berg before 9), the backup to a file and back
// (engine/backup.js), and deleting progress. Texts in eltern/lang/<language>.js, names from lang/<language>.js.
//
// Nothing here is shown to a child as an achievement: a pure game (number memory) is listed with its rounds,
// without stars and without "mastered".

import { MAPS, BERG_BASICS } from "../content/universe.js";
import { PERSPECTIVES, CARDS } from "../content/perspectives.js";
import { holds } from "../engine/graph.js";
import { shared as S, textsIn, num, lang, LANGS } from "../engine/i18n.js";
import * as profiles from "../engine/profiles.js";
import * as L from "../engine/learner.js";
import { store } from "../engine/store.js";
import { state, load, loadAll, texts as ideaTexts } from "../engine/app.js";
import { report } from "../engine/report.js";
import * as backup from "../engine/backup.js";
import { href, go } from "../engine/router.js";
import { el, button, link, icons } from "../engine/ui/parts.js";
import { kidForm } from "../engine/ui/kidform.js";
import { voice } from "../engine/ui/voice.js";
import { groupName } from "../engine/ui/station.js";

const T = await textsIn(new URL("./lang/", import.meta.url));

/** "2026-11-24" → a short local date ("24.11.2026"). */
function showDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return num(new Date(y, m - 1, d).toLocaleDateString(LANGS[lang].voice));
}

const kidName = (kid) => (kid ? kid.name || T.noName : T.guest);

/** An on/off switch: a checkbox that looks like one. */
function toggle(checked, label, onChange) {
  const wrap = el("label", "switch");
  const box = el("input");
  box.type = "checkbox";
  box.setAttribute("role", "switch");
  box.checked = checked;
  box.setAttribute("aria-label", label);
  box.addEventListener("change", () => onChange(box.checked));
  wrap.append(box, el("span", "slider"));
  return wrap;
}

export async function render(root, route) {
  voice.aloud = false; // this page is for grown-ups: nothing is read aloud
  document.title = `${T.title} · ${S.app}`;
  const kids = profiles.all();
  // The child whose progress is shown: ?kind=<id>, else the child playing now, else the guest.
  const wanted = route.q.kind;
  const shown = wanted === "guest" ? null : (profiles.get(wanted) ?? (wanted ? null : profiles.current()));
  const rec = L.valid(store.get(`learner:${shown?.id ?? "guest"}`, null), shown?.id ?? "guest");
  const age = profiles.age(shown);
  await loadAll();
  const defs = state.defs;
  const facts = L.facts(rec, { age, defs });
  const R = report(rec, { defs, age, facts });

  const top = el("div", "topbar");
  const home = link("icon-btn", href.home());
  home.setAttribute("aria-label", S.labels.home);
  home.innerHTML = icons.home;
  top.append(home, el("h1", "title", T.title), el("div", "icon-gap"));
  root.classList.add("parents");
  root.append(top, el("p", "intro", T.intro));

  // ---------- Children

  const kidsCard = el("section", "card p-card");
  kidsCard.append(el("h2", "", T.kidsTitle), el("p", "muted", kids.length ? T.kidsNote : T.noKids));
  const list = el("ul", "kid-list");
  for (const kid of kids) {
    const li = el("li", "kid-row");
    li.append(el("span", "kid-animal", kid.animal));
    const info = el("div", "kid-info");
    info.append(el("strong", "", kidName(kid)), el("span", "muted", T.years(profiles.age(kid))));
    const edit = button("btn small", `${T.edit}: ${kidName(kid)}`, T.edit);
    edit.addEventListener("click", () => openForm(kid));
    const del = button("btn small", `${T.remove}: ${kidName(kid)}`, T.remove);
    del.addEventListener("click", () => {
      if (!confirm(T.removeConfirm(kidName(kid)))) return;
      profiles.remove(kid.id);
      load();
      go(href.parents());
    });
    const buttons = el("div", "kid-buttons");
    buttons.append(edit, del);
    li.append(info, buttons);
    list.append(li);
  }
  const form = el("form", "kid-form");
  form.hidden = true;
  const add = button("btn", T.addKid, T.addKid);
  function openForm(kid) {
    add.hidden = true;
    kidForm(form, {
      kid,
      saveText: kid ? S.home.save : T.addKid,
      onSave: (values) => {
        const id = kid ? (profiles.update(kid.id, values), kid.id) : profiles.add(values);
        load();
        go(href.parents(id));
      },
      onCancel: () => (add.hidden = false),
    });
  }
  add.addEventListener("click", () => openForm(null));
  kidsCard.append(list, form, add);
  root.append(kidsCard);

  // ---------- Whose progress: tabs (with two or more, or a guest who played next to children)

  const guestPlayed = Object.keys(store.get("learner:guest", null)?.ideas ?? {}).length > 0;
  const tabsFor = [...kids, ...(guestPlayed || !kids.length ? [null] : [])];
  if (tabsFor.length > 1) {
    const tabs = el("nav", "kid-tabs");
    for (const kid of tabsFor) {
      const on = (kid?.id ?? null) === (shown?.id ?? null);
      const a = link("kid-tab" + (on ? " on" : ""), href.parents(kid?.id ?? "guest"), `${kid?.animal ?? "🙂"} ${kidName(kid)}`);
      if (on) a.setAttribute("aria-current", "page");
      tabs.append(a);
    }
    root.append(tabs);
  }
  root.append(el("h2", "progress-of", T.progressOf(kidName(shown))));

  // ---------- Settings of this child: reading aloud, the Berg before 9

  const settings = el("section", "card p-card");
  settings.append(el("h2", "", T.settingsTitle));
  if (shown) {
    const hint = el("span", "muted");
    const say = () => {
      const on = profiles.readAloud(shown);
      const mine = typeof shown.readAloud === "boolean";
      hint.textContent = `${on ? T.readAloudOn(kidName(shown)) : T.readAloudOff(kidName(shown))} · ${mine ? T.byYou : T.readAloudAge(profiles.READ_ALOUD_UNTIL)}`;
    };
    say();
    settings.append(
      settingRow("🔊", T.readAloudTitle, hint, toggle(profiles.readAloud(shown), T.readAloudLabel(kidName(shown)), (on) => {
        const byAge = profiles.readAloud({ ...shown, readAloud: undefined });
        profiles.setReadAloud(shown.id, on === byAge ? null : on);
        shown.readAloud = profiles.get(shown.id).readAloud;
        say();
      })),
    );
  } else {
    settings.append(el("p", "muted", T.guestSettings));
  }
  // The Berg: by age (9), by the school basics, or by this switch (docs/DESIGN.md, section 4.4).
  {
    const byAge = age !== null && age >= 9;
    const byBasics = holds(BERG_BASICS, facts);
    const hint = el("span", "muted");
    const row = settingRow("⛰️", T.bergTitle, hint, null);
    if (byAge || byBasics) {
      hint.textContent = byAge ? T.bergByAge(kidName(shown)) : T.bergByBasics(kidName(shown));
    } else {
      const say = () => (hint.textContent = (rec.parent?.berg ? T.bergOn : T.bergOff)(kidName(shown)));
      say();
      row.append(toggle(!!rec.parent?.berg, T.bergLabel(kidName(shown)), (on) => {
        rec.parent = { ...rec.parent, berg: on };
        store.set(`learner:${shown?.id ?? "guest"}`, rec);
        load();
        say();
      }));
    }
    settings.append(row, el("p", "muted small", T.bergNote));
  }
  root.append(settings);

  function settingRow(icon, title, hint, control) {
    const row = el("div", "p-row");
    row.append(el("span", "p-row-icon", icon));
    const info = el("div", "p-row-info");
    info.append(el("strong", "", title), hint);
    row.append(info);
    if (control) row.append(control);
    return row;
  }

  // ---------- The last 14 days

  const days = el("section", "card p-card");
  days.append(el("h2", "", T.daysTitle));
  const most = Math.max(1, ...R.days.map((d) => d.right + d.wrong));
  const bars = el("div", "bars");
  for (const d of R.days) {
    const col = el("div", "bar");
    col.title = `${showDate(d.day)}: ${num(d.right)} / ${num(d.wrong)}`;
    const stack = el("div", "stack");
    const wrong = el("div", "p-part wrong");
    wrong.style.height = (d.wrong / most) * 100 + "%";
    const right = el("div", "p-part right");
    right.style.height = (d.right / most) * 100 + "%";
    stack.append(wrong, right);
    col.append(stack, el("span", "day", T.weekdays[d.date.getDay()]));
    bars.append(col);
  }
  const legend = el("p", "legend");
  legend.append(el("span", "key right"), el("span", "", T.legendRight), el("span", "key wrong"), el("span", "", T.legendWrong));
  const t = R.days.at(-1);
  days.append(bars, legend, el("p", "", T.today(t.right, t.wrong, t.rounds)));
  root.append(days);

  // ---------- How to read the report

  const how = el("details", "card p-card how");
  how.append(el("summary", "", T.howTitle));
  how.append(el("p", "", T.how[0]));
  const ways = el("ul", "ways");
  for (const p of PERSPECTIVES.filter((x) => !x.alone)) ways.append(el("li", "", `${p.icon} ${S.perspectives.standard[p.id]}`));
  how.append(ways);
  how.append(el("p", "muted", T.bergNames(PERSPECTIVES.filter((x) => !x.alone).map((p) => S.perspectives.berg[p.id]).join(", "))));
  for (const p of T.how.slice(1)) how.append(el("p", "", p));
  root.append(how);

  // ---------- Map by map, station by station

  for (const m of R.maps) {
    if (!m.stations.length) continue;
    const box = el("details", `card p-card map-report map-${m.id}`);
    box.open = m.played;
    const sum = el("summary");
    sum.append(el("span", "map-name", S.maps[m.id].name));
    sum.append(el("span", "muted", m.played ? T.mapSummary(m.mastered, m.learn) : m.open ? T.mapNotPlayed : T.notOpen));
    const meter = el("div", "meter");
    const fill = el("div", "meter-fill");
    fill.style.width = (m.learn ? (m.mastered / m.learn) * 100 : 0) + "%";
    meter.append(fill);
    sum.append(meter);
    box.append(sum, el("p", "muted small", T.mapNotes[m.id] ?? ""));
    const names = S.perspectives[MAPS.find((x) => x.id === m.id).perspectiveNames] ?? S.perspectives.standard;
    for (const s of m.stations) box.append(await stationRow(s, names));
    root.append(box);
  }

  async function stationRow(s, names) {
    const row = el("div", "st" + (s.mastered ? " done" : s.played ? " played" : "") + (s.open ? "" : " closed"));
    const head = el("div", "st-head");
    head.append(el("span", "st-icon", s.icon ?? ""));
    const title = el("div", "st-title");
    title.append(el("strong", "", S.stations[s.id] ?? s.id));
    head.append(title);
    if (s.mastered) head.append(el("span", "badge done", `✓ ${T.mastered}`));
    row.append(head);

    for (const i of s.ideas) {
      const def = defs[i.id];
      const idea = el("div", "st-idea");
      idea.append(el("span", "st-about", S.ideas[i.id]?.about ?? S.ideas[i.id]?.name ?? i.id));
      const lines = [];
      if (i.game) {
        lines.push(T.game);
      } else if (i.rounds || i.visited) {
        const step = def.rungName?.(L.rung(def, i.rung), await ideaTexts(i.id)); // a sub-step (Feld)
        const g = def.levels ? T.levelOf(i.groupIndex + 1, i.groups) : `${groupName(i.group, def)}${i.groups > 1 ? " · " + T.levelOf(i.groupIndex + 1, i.groups) : ""}`;
        lines.push(step ? `${g} · ${step}` : g);
      }
      if (i.rounds) lines.push(T.rounds(i.rounds, i.visited ? showDate(i.visited) : "–"));
      else lines.push(s.open || s.game ? T.notPlayed : T.notOpen);
      for (const line of lines) idea.append(el("span", "muted", line));

      if (!i.game && (i.rounds || i.visited)) {
        const ps = el("ul", "st-ways");
        for (const p of i.perspectives) {
          const icon = PERSPECTIVES.find((x) => x.id === p.id)?.icon ?? "";
          const li = el("li", p.star ? "star" : p.played ? "played" : "");
          li.append(el("span", "w-icon", icon), el("span", "w-name", names[p.id]), el("span", "w-state", p.star ? "⭐" : p.played ? "🌱" : ""));
          if (p.n) li.append(el("span", "w-first", T.firstTry(p.first, p.n)));
          ps.append(li);
        }
        idea.append(ps);
        if (!i.mastered) idea.append(el("span", "muted", T.stars(i.stars, i.perspectives.length)));
        if (i.gate) idea.append(el("span", "muted", T.started(groupName(i.gate.group, def))));
        if (i.lowered) idea.append(el("span", "muted", T.lowered));
        if (i.mistake && T.mistakes[i.mistake]) idea.append(el("span", "p-note", T.mistake(T.mistakes[i.mistake])));
        if (i.box) {
          idea.append(el("span", "muted", T.boxKnown(i.box.known, i.box.facts)));
          const SIGN = { plus: "+", minus: "−", mal: "·", geteilt: ":" };
          if (i.box.shaky.length) idea.append(el("span", "p-note", T.boxShaky(i.box.shaky.map(([a, b]) => `${num(a)} ${SIGN[i.id] ?? "?"} ${num(b)}`).join(", "))));
        }
      }
      row.append(idea);
    }
    if (s.leadsTo.length && s.played) row.append(el("p", "muted small", T.leadsTo(s.leadsTo.map((id) => S.stations[id] ?? id).join(", "))));
    return row;
  }

  // ---------- Thinking cards

  if (R.cards.length) {
    const cards = el("section", "card p-card");
    cards.append(el("h2", "", T.cardsTitle), el("p", "muted", T.cardsNote));
    const ul = el("ul", "cards");
    for (const c of R.cards) ul.append(el("li", "", `${CARDS[c.id] ?? "✨"} ${S.cards[c.id]?.name ?? c.id} × ${num(c.n)}`));
    cards.append(ul);
    root.append(cards);
  }

  // ---------- Backup: everything to a file and back

  const bk = el("section", "card p-card");
  bk.append(el("h2", "", T.backupTitle), el("p", "", T.backupNote));
  const status = el("p", "status");
  status.setAttribute("aria-live", "polite");
  const save = button("btn sun", T.backupSave, T.backupSave);
  save.addEventListener("click", () => {
    const day = L.today();
    const file = new Blob([JSON.stringify(backup.pack(backup.read(), day), null, 1)], { type: "application/json" });
    const a = el("a");
    a.href = URL.createObjectURL(file);
    a.download = `ankaplay-${day}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    status.textContent = T.backupSaved;
  });
  const input = el("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.hidden = true;
  const open = button("btn", T.backupLoad, T.backupLoad);
  open.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const chosen = input.files[0];
    input.value = "";
    if (!chosen) return;
    let file = null;
    try {
      file = JSON.parse(await chosen.text());
    } catch {
      /* not JSON: unpack says it does not fit */
    }
    const got = backup.unpack(file);
    if (got.error) return void (status.textContent = got.error === "thinklab" ? T.backupThinklab : T.backupBad);
    if (!confirm(T.backupConfirm)) return;
    backup.write(got.data);
    load();
    status.textContent = T.backupLoaded;
    // Reload, so the language of the file and every screen start fresh.
    setTimeout(() => location.replace(location.pathname + href.parents()), 600);
  });
  const btns = el("div", "p-buttons");
  btns.append(save, open, input);
  bk.append(btns, status);
  const keepStatus = el("p", "status");
  keepStatus.setAttribute("aria-live", "polite");
  const keep = button("btn", T.keep, T.keep);
  keep.addEventListener("click", async () => {
    let kept = false;
    try {
      kept = (await navigator.storage?.persist?.()) === true;
    } catch {
      /* not offered by this browser */
    }
    keepStatus.textContent = kept ? T.kept : T.notKept;
  });
  bk.append(el("p", "muted", T.keepNote), keep, keepStatus, el("p", "muted small", T.offline));
  root.append(bk);

  // ---------- Delete this child's progress, privacy

  const reset = button("btn small danger", T.reset, T.reset);
  reset.addEventListener("click", () => {
    if (!confirm(T.resetConfirm(kidName(shown)))) return;
    store.remove(`learner:${shown?.id ?? "guest"}`);
    load();
    go(href.parents(shown?.id ?? "guest"));
  });
  const foot = el("div", "p-foot");
  foot.append(reset, link("privacy-link", "/datenschutz/", T.privacy));
  root.append(foot);

  return () => root.classList.remove("parents");
}
