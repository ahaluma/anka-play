// Sentences of the idea "daten" in this language. So far only the bag of balls and the weather chart, which came
// from the sunny rock with their translation; the rest comes in German until it is translated.

export default {
  daten: {
    forschen: {
      draw: "Take a ball",
      colours: { red: "red", blue: "blue", yellow: "yellow", green: "green" },
      same: "Just as often",
      chance: { sure: "certain", maybe: "possible", never: "impossible" },
      askMost: "Which colour will you take out most often? Try it!",
      askChance: (c) => `You take one without looking. A ${c} ball: is that certain, possible or impossible?`,
      missMost: "Count the balls of each colour.",
      missChance: { sure: "Certain means: it always comes. Are all balls like that?", maybe: "Possible means: it can come, but it does not have to.", never: "Impossible means: it cannot come at all. Is there no such ball?" },
      doneMost: (c) => `Most balls are ${c}. ${c[0].toUpperCase() + c.slice(1)} will come most often.`,
      doneSame: "There are as many of both: they will come about as often.",
      doneChance: {
        sure: (c) => `All balls are ${c}: that is certain.`,
        maybe: (c) => `There are ${c} ones and others: that is possible.`,
        never: (c) => `No ball is ${c}: that is impossible.`,
      },
      hintMost: "The balls are sorted by colour now. Where are the most?",
      hintChance: "The balls are sorted by colour now. Which colours are in the bag?",
    },    anwenden: {
      chartTitle: "The weather in two weeks",
      weather: { sun: "sun", cloud: "clouds", rain: "rain", snow: "snow" },
      mostAsk: "Which weather came most often?",
      mostMiss: "Look which row is the longest.",
      mostDone: (w, n) => `Most often there was ${w}: on ${n} days.`,
      mostHint: "The longest row wins.",
      countAsk: (w) => `On how many days was there ${w}?`,
      countMiss: "Count the pictures in the row.",
      countDone: (w, n, count) => `There was ${w} on ${count === 1 ? "one day" : n + " days"}.`,
      countHint: "Read the number below the end of the bar.",
      diffAsk: (a, b) => `How many more days of ${a} than of ${b}?`,
      diffMiss: "Compare the two rows: how much longer is one?",
      diffSum: "That is both together. The question is: how many more?",
      diffDone: (a, b, n) => `There were ${n} more days of ${a} than of ${b}.`,
      diffHint: "Take the bigger number minus the smaller one.",
    },  },
};
