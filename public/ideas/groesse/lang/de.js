// Sätze/sentences of the idea "groesse", Deutsch. Ported from think-lab (welt/lang/de.js) as they were:
// the board (ideas/groesse/board.js) calls them with number words, as there.
const big = (text) => text[0].toUpperCase() + text.slice(1); // "drei" -> "Drei"

export default {
  groesse: {
    intro: {
      sehen: "Was ist länger, was ist höher? Schau genau.",
      machen: "Leg die Dinge der Größe nach.",
      forschen: "Die Waage: Was ist schwerer? Erst denken!",
      anwenden: "Was passt den Bären?",
      pruefen: "Die Eule vergleicht. Stimmt das?",
    },
    kinds: {
      lang: {
        one: "Schlange",
        smallest: "die kürzeste Schlange",
        ask: { more: { two: "Welche Schlange ist länger?", many: "Welche Schlange ist am längsten?" }, less: { two: "Welche Schlange ist kürzer?", many: "Welche Schlange ist am kürzesten?" } },
        done: { more: { two: "Diese Schlange ist länger.", many: "Diese Schlange ist am längsten." }, less: { two: "Diese Schlange ist kürzer.", many: "Diese Schlange ist am kürzesten." } },
        miss: { more: "Eine andere Schlange ist noch länger.", less: "Eine andere Schlange ist noch kürzer." },
      },
      hoch: {
        one: "Turm",
        smallest: "den niedrigsten Turm",
        ask: { more: { two: "Welcher Turm ist höher?", many: "Welcher Turm ist am höchsten?" }, less: { two: "Welcher Turm ist niedriger?", many: "Welcher Turm ist am niedrigsten?" } },
        done: { more: { two: "Dieser Turm ist höher.", many: "Dieser Turm ist am höchsten." }, less: { two: "Dieser Turm ist niedriger.", many: "Dieser Turm ist am niedrigsten." } },
        miss: { more: "Ein anderer Turm ist noch höher.", less: "Ein anderer Turm ist noch niedriger." },
      },
      wasser: {
        one: "Glas",
        smallest: "das Glas mit dem wenigsten Wasser",
        ask: { more: { two: "In welchem Glas ist mehr Wasser?", many: "In welchem Glas ist am meisten Wasser?" }, less: { two: "In welchem Glas ist weniger Wasser?", many: "In welchem Glas ist am wenigsten Wasser?" } },
        done: { more: { two: "In diesem Glas ist mehr Wasser.", many: "In diesem Glas ist am meisten Wasser." }, less: { two: "In diesem Glas ist weniger Wasser.", many: "In diesem Glas ist am wenigsten Wasser." } },
        miss: { more: "In einem anderen Glas ist noch mehr Wasser.", less: "In einem anderen Glas ist noch weniger Wasser." },
      },
    },
    sehen: {
      hint: "Vergleich sie oben: Wer reicht am weitesten?",
      hintLine: "Schieb sie in Gedanken an eine Linie. Jetzt siehst du, welche wirklich weiter reicht.",
    },
    machen: {
      ask: (smallest) => `Leg sie der Größe nach! Tipp zuerst auf ${smallest}, dann immer auf die nächste.`,
      missFirst: (smallest) => `Zuerst kommt ${smallest}.`,
      miss: (smallest) => `Nimm von denen, die noch übrig sind, ${smallest}.`,
      done: "Jetzt stehen sie der Größe nach: vom kleinsten bis zum größten.",
      hint: (smallest) => `Such ${smallest}: Die leuchtet.`,
    },
    forschen: {
      ask: "Was ist schwerer? Denk erst, dann tipp darauf!",
      miss: "Schau, die Waage geht auf der schweren Seite nach unten.",
      missTricky: "Klein heißt nicht leicht! Die Waage geht auf der schweren Seite nach unten.",
      done: "Ja! Die schwere Seite geht nach unten.",
      doneTricky: "Ja! Es ist klein, aber schwer. Die schwere Seite geht nach unten.",
      hint: "Stell dir vor, du trägst beides. Was ist schwerer zu tragen?",
    },
    anwenden: {
      bears: ["der kleine Bär", "der mittlere Bär", "der große Bär"],
      items: { bett: "ein Bett", stuhl: "einen Stuhl", schuessel: "eine Schüssel", pulli: "einen Pulli", schuh: "einen Schuh" },
      ask: (bear, item) => `${big(bear)} braucht ${item}. Was passt?`,
      tooBig: "Das ist zu groß.",
      tooSmall: "Das ist zu klein.",
      done: (i) => `Das passt genau für ${["den kleinen Bären", "den mittleren Bären", "den großen Bären"][i]}.`,
      hint: "Kleiner Bär, kleine Sachen. Großer Bär, große Sachen.",
    },
    pruefen: {
      says: "Die ist am längsten!",
      question: "Die Eule zeigt auf eine Schlange und sagt: Die ist am längsten. Stimmt das?",
      right: "Ja, diese Schlange ist am längsten.",
      lookAgain: "Vergleich die Schlangen noch einmal genau.",
      lookStart: "Schau auch, wo die Schlangen anfangen! Nicht alle fangen an derselben Stelle an.",
      isRight: "Schau noch einmal: Keine Schlange ist länger als diese.",
      fix: "Gut aufgepasst! Welche Schlange ist wirklich am längsten? Tipp darauf.",
      fixMiss: "Die ist nicht am längsten. Schau, wo sie anfängt und wo sie aufhört.",
      fixed: "Jetzt stimmt es: Diese Schlange ist am längsten.",
      hint: "Schau, jetzt fangen alle an einer Linie an.",
    },
  },
};
