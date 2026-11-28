// Sentences of the idea "zehn" (station Teich), Nepali, written as one says it in Nepali. The board
// (ideas/zehn/board.js) calls them with number words.
const SIDE = { left: "बायाँ", right: "दायाँ" };

export default {
  zehn: {
    intro: {
      machen: "भ्यागुताहरूलाई दुईवटा कमलका पातमा राख!",
      sehen: "केही भ्यागुता लुकेका छन्। कतिवटा?",
      forschen: "एउटा भ्यागुता उफ्रेर अर्को पातमा जान्छ। के उस्तै रहन्छ?",
      anwenden: "कुन सङ्ख्या छुट्यो?",
      pruefen: "लाटोकोसेरोले भ्यागुता बाँड्यो। ठिक छ?",
    },
    friends: (a, b, whole) => `${a} र ${b} मिलेर ${whole} हुन्छ।`,
    machen: {
      question: (whole, side, target) => `${whole}वटा भ्यागुता छन्। ${SIDE[side]} पातमा ${target}वटा बस्नुपर्छ।`,
      allQuestion: (whole, ways) => `दुईवटा पातमा ${whole}वटा भ्यागुता। तिनलाई ${ways} तरिकाले बाँड!`,
      how: "भ्यागुतालाई छोऊ, ऊ उफ्रेर अर्को पातमा जान्छ।",
      hop: "भ्यागुता उफ्रन्छ",
      miss: (side, has, target) => `${SIDE[side]} पातमा ${has}वटा छन्। ${target}वटा हुनुपर्छ।`,
      both: "हरेक पातमा कम्तीमा एउटा भ्यागुता हुनुपर्छ।",
      again: "यो त भइसक्यो। अर्को तरिका खोज!",
      more: (word, k) => (k === 1 ? "राम्रो! अझै एउटा तरिका।" : `राम्रो! अझै ${word}वटा तरिका।`),
      allDone: (whole) => `भ्यागुता सधैँ ${whole}वटा नै, बाँड्ने तरिका मात्र फरक।`,
      hint: (side, target) => `${SIDE[side]} पातमा गन। ${target}वटा हुनुपर्छ।`,
      hintAll: "एउटा भ्यागुतालाई उफ्राऊ, अनि अर्को।",
    },
    sehen: {
      story: (whole) => `कमलका पातमा ${whole}वटा भ्यागुता बसेका छन्।`,
      dive: "केही भ्यागुता पातमुनि लुक्छन्।",
      ask: (n) => `${n}वटा देख्छौ। कतिवटा लुकेका छन्?`,
      miss: (n, chosen, sum, whole) => `${n} र ${chosen} मिलेर ${sum} हुन्छ। तर भ्यागुता ${whole}वटा छन्।`,
      hint: (whole) => `यहाँ ${whole}वटा ठाउँ छन्। खाली ठाउँका भ्यागुता पातमुनि छन्।`,
    },
    forschen: {
      story: (whole) => `दुईवटा कमलका पातमा ${whole}वटा भ्यागुता बसेका छन्।`,
      jump: { left: "एउटा भ्यागुता बायाँतिर उफ्रन्छ।", right: "एउटा भ्यागुता दायाँतिर उफ्रन्छ।" },
      ask: { left: "अब बायाँ पातमा कतिवटा हुन्छन्?", right: "अब दायाँ पातमा कतिवटा हुन्छन्?" },
      more: "एउटा थपिन्छ। त्यसैले पहिलेभन्दा बढी हुन्छन्।",
      onlyOneIn: "एउटा मात्र थपिन्छ।",
      fewer: "एउटा उफ्रेर जान्छ। त्यसैले पहिलेभन्दा कम हुन्छन्।",
      onlyOneOut: "एउटा मात्र उफ्रेर जान्छ।",
      done: (whole) => `यता एउटा बढ्यो, उता एउटा घट्यो। जम्मा ${whole} नै रह्यो।`,
      hint: "भ्यागुता कहाँ पुग्छ, हेर। त्यहाँ एउटा बढ्छ, छोडेको पातमा एउटा घट्छ।",
      hintShown: "यता एउटा बढी, उता एउटा कम।",
    },
    anwenden: {
      and: "र",
      are: "मिलेर",
      question: (n, whole) => `${n} र कति मिलेर ${whole} हुन्छ?`,
      miss: (n, chosen, sum, whole) => `${n} र ${chosen} मिलेर ${sum} हुन्छ, ${whole} होइन।`,
      hint: "खाली ठाउँहरू अझै चाहिन्छन्।",
    },
    pruefen: {
      says: (whole) => `यी ${whole}वटा भए!`,
      question: (a, b, whole) => `लाटोकोसेरो भन्छ: ${a} र ${b} मिलेर ${whole} हुन्छ। ठिक हो?`,
      look: (over) => (over ? "फेरि गन। एउटा बढी त छैन?" : "फेरि गन। एउटा कम त छैन?"),
      isRight: (whole) => `फेरि गन। ठ्याक्कै ${whole}वटा छन्।`,
      fix: (whole) => `हो, मिलेन! ${whole} पुर्‍याउन दायाँ पातमा कतिवटा हुनुपर्छ?`,
      fixMiss: (a, chosen, sum, whole) => `${a} र ${chosen} मिलेर ${sum} हुन्छ, ${whole} होइन।`,
      hint: (whole) => `सबै ${whole}वटा ठाउँ भरिनुपर्छ, कुनै बढी होइन।`,
    },
  },
};
