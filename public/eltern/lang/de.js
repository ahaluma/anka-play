// Deutsche Texte für die Elternseite (#/eltern). Die Namen der Karten, Stationen, Ideen und Sichtweisen
// kommen aus den gemeinsamen Wörtern (lang/de.js). Zahlen kommen als Zahlen und werden mit n() geschrieben.
import { num as n } from "../../engine/i18n.js";

export default {
  title: "Für Eltern",
  intro: "Hier sehen Sie, was Ihr Kind spielt und wie weit es ist. Alles bleibt auf diesem Gerät, nichts wird verschickt.",

  // Kinder
  kidsTitle: "Kinder",
  kidsNote: "Jedes Kind hat seinen eigenen Fortschritt. Name und Tier sieht das Kind beim Spielen.",
  noKids: "Noch kein Kind angelegt. Ohne Kind spielt ein Gast, sein Fortschritt steht unten.",
  addKid: "Kind hinzufügen",
  edit: "Ändern",
  remove: "Löschen",
  removeConfirm: (name) => `${name} und den ganzen Fortschritt löschen?`,
  years: (a) => `${n(a)} Jahre`,
  noName: "Ohne Namen",
  guest: "Gast",
  progressOf: (name) => `Fortschritt: ${name}`,

  // Einstellungen pro Kind
  settingsTitle: "Einstellungen",
  readAloudTitle: "Überall vorlesen",
  readAloudOn: (name) => `Die Spiele lesen ${name} auf jeder Karte jeden Satz vor`,
  readAloudOff: () => `Im Tal wird alles vorgelesen, auf Fluss, Feld und Berg nur auf Tipp auf 🔊`,
  readAloudAge: () => "so ist es ohne Ihre Wahl: Vorschulkinder brauchen die Stimme, Schulkinder lesen selbst",
  readAloudNever: "Vorgelesen wird nur auf Tipp auf 🔊",
  readAloudLabel: (name) => `Für ${name} auf jeder Karte vorlesen`,
  byYou: "von Ihnen eingestellt",
  guestSettings: "Ein Gast hat keine eigenen Einstellungen: Er bekommt alles vorgelesen.",
  bergTitle: "Den Berg schon jetzt öffnen",
  bergNote: "Der Berg (Knobeln, 9 bis 12 Jahre) öffnet sich mit 9 Jahren oder wenn die Grundlagen der Schule geschafft sind: Steg, Blumenfeld, Apfelbaum und Beeren. Mit diesem Schalter öffnen Sie ihn schon vorher.",
  bergLabel: (name) => `Den Berg für ${name} öffnen`,
  bergOn: (name) => `Der Berg ist für ${name} offen, weil Sie ihn geöffnet haben`,
  bergOff: (name) => `Der Berg ist für ${name} noch zu`,
  bergByAge: (name) => `Der Berg ist für ${name} offen: ab 9 Jahren von selbst.`,
  bergByBasics: (name) => `Der Berg ist für ${name} offen: die Grundlagen der Schule sind geschafft.`,

  // Die letzten Tage
  daysTitle: "Letzte 14 Tage",
  legendRight: "auf Anhieb richtig",
  legendWrong: "mit mehr Versuchen",
  today: (right, wrong, rounds) =>
    `Heute: ${n(right + wrong)} ${right + wrong === 1 ? "Aufgabe" : "Aufgaben"}, davon ${n(right)} auf Anhieb richtig · ` +
    `${n(rounds)} ${rounds === 1 ? "Runde" : "Runden"}`,
  weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],

  // Die Karten
  howTitle: "So lesen Sie den Bericht",
  how: [
    "Jede Station übt eine Idee auf bis zu fünf Arten:",
    "Ein Stern ⭐ heißt: eine Runde mit 4 von 5 Aufgaben auf Anhieb richtig, auf der Stufe, auf der Ihr Kind gerade ist. 🌱 heißt: schon gespielt, noch ohne Stern. Mit genug Sternen geht es eine Stufe höher; nach zwei schwierigen Runden eine zurück.",
    "„Geschafft“ heißt: jede Art der Station hat ihren Stern auf der höchsten Stufe. Spiele wie das Zahlen-Memory sind immer offen und haben keine Sterne.",
  ],
  bergNames: (names) => `Auf dem Berg heißen sie: ${names}.`,
  mapSummary: (done, of) => `${n(done)} von ${n(of)} ${of === 1 ? "Station" : "Stationen"} geschafft`,
  mapNotPlayed: "Noch nicht gespielt",
  mapNotes: {
    tal: "Für 3 bis 6 Jahre: Zahlen, Formen, Muster, mit Dingen und Bildern, ohne Rechenzeichen. Eine Runde hat 3 Aufgaben, ab 7 Jahren 5.",
    fluss: "Schule: Zahlenstrahl, Zehner und Einer, Formen, Uhr und Kalender. Öffnet sich ab 6 Jahren oder wenn Wiese und Teich im Tal geschafft sind.",
    feld: "Schule: Plus, Minus, Mal, Geteilt, Geld und Rechengeschichten. Hier gibt es Teilstufen: Eine gute Runde führt eine Teilstufe weiter, Sterne gibt es auf der obersten, wenn alles gemischt kommt. Was noch wackelt, kommt öfter wieder.",
    berg: "Knobeln für 9 bis 12 Jahre: zwölf Lager mit je einer Denkstrategie und der Gipfel. Ein Lager kommt aus dem Nebel, wenn die darunter geschafft sind. Nach jeder Runde fragt der Berg: Wie war das?",
  },

  // Eine Station
  notPlayed: "Noch nicht gespielt",
  notOpen: "Noch nicht offen",
  mastered: "Geschafft",
  levelOf: (i, of) => `Stufe ${n(i)} von ${n(of)}`,
  stars: (k, of) => `${n(k)} von ${n(of)} ${of === 1 ? "Stern" : "Sternen"} auf dieser Stufe`,
  rounds: (k, date) => `${n(k)} ${k === 1 ? "Runde" : "Runden"} · zuletzt ${date}`,
  firstTry: (first, of) => `${n(first)} von ${n(of)} auf Anhieb`,
  started: (level) => `Begonnen bei „${level}“, nach den Fragen beim ersten Besuch`,
  lowered: "Gerade eine Stufe leichter, nach zwei schwierigen Runden",
  game: "Ein Spiel: immer offen, ohne Sterne",
  leadsTo: (names) => `Führt später weiter zu: ${names}`,
  mistake: (what) => `Häufiger Fehler: ${what}`,
  mistakes: {
    oneOff: "um eins daneben (verzählt)",
    eins: "um eins daneben (verzählt)",
    zehner: "der Zehner beim Übertrag fehlt",
    forgotTen: "der Zehner beim Übertrag fehlt",
    kleinergroesser: "bei Minus wird die kleinere von der größeren Ziffer abgezogen",
    smallerFromBigger: "bei Minus wird die kleinere von der größeren Ziffer abgezogen",
    vertauscht: "Zehner und Einer vertauscht",
    swappedDigits: "Zehner und Einer vertauscht",
    rechenart: "falsche Rechenart (zum Beispiel Plus statt Mal)",
    wrongOp: "falsche Rechenart (zum Beispiel Plus statt Mal)",
    nachbar: "die Nachbaraufgabe (eine Reihe zu viel oder zu wenig)",
    rest: "der Rest beim Teilen",
    countedPieces: "Münzen gezählt statt ihren Wert",
    postsVsGaps: "Pfähle gezählt statt Lücken",
  },
  boxKnown: (known, of) => `${n(known)} von ${n(of)} geübten Grundaufgaben sitzen schon sicher.`,
  boxShaky: (list) => `Wackelt noch: ${list}`,

  // Denk-Tricks
  cardsTitle: "Denk-Tricks",
  cardsNote: "Nach jeder Runde bekommt Ihr Kind eine Karte für den Denk-Trick, den es benutzt hat.",

  // Sichern
  backupTitle: "Sichern und umziehen",
  backupNote: "Speichern Sie alles (alle Kinder und ihren Fortschritt) als Datei, zum Beispiel für ein neues Handy. Dort laden Sie die Datei hier wieder. Die App verschickt nichts. Dateien vom alten think-lab passen nicht.",
  backupSave: "Als Datei speichern",
  backupLoad: "Aus Datei laden",
  backupSaved: "Die Datei wurde gespeichert.",
  backupLoaded: "Der Fortschritt wurde geladen.",
  backupBad: "Diese Datei passt nicht. Bitte wählen Sie eine Datei, die hier mit AnkaPlay gespeichert wurde.",
  backupThinklab: "Das ist eine Datei vom alten think-lab. AnkaPlay fängt neu an und übernimmt sie nicht.",
  backupConfirm: "Alles auf diesem Gerät wird durch die Datei ersetzt. Fortfahren?",
  keepNote: "Der Browser darf Daten löschen, wenn die Seite lange nicht geöffnet wird. Legen Sie AnkaPlay auf den Home-Bildschirm und tippen Sie hier, dann bleibt der Fortschritt erhalten.",
  keep: "Speicher behalten",
  kept: "Der Browser behält den Speicher dauerhaft.",
  notKept: "Der Browser hat das nicht zugesagt. Sichern Sie ab und zu als Datei.",
  offline: "AnkaPlay funktioniert nach dem ersten Besuch auch ohne Internet.",

  // Löschen
  reset: "Fortschritt löschen",
  resetConfirm: (name) => `Den ganzen Fortschritt von ${name} löschen? Das Kind bleibt, es fängt neu an.`,
  privacy: "Datenschutz",
  info: "Was Ihr Kind lernt",
  infoNote: "Jede Welt und jede Station erklärt: was Ihr Kind dort tut, was es lernt und warum.",
};
