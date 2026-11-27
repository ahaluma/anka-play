// Sätze/sentences of the idea "zehn", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/zehn/board.js) calls them with number words, as there.

export default {
  zehn: {
    intro: {
      sehen: "भ्यागुताहरू कमलका पातमा बसेका छन्। कतिवटा पात खाली छन्?",
      machen: "ओखरको बाकस पूरा भर!",
      forschen: "यता एक बढी, उता एक कम। के छुट्यो?",
      anwenden: "कुन सङ्ख्याले पूरा भर्छ?",
      pruefen: "लाटोकोसेरोले दुईवटा सङ्ख्या भन्छ। के ती मिलेर पूरा भर्छन्?",
    },
    friends: (a, b, whole) => `${a} र ${b} मिलेर ${whole} हुन्छ।`,
    sehen: {
      story: (whole, n, nWord) => `पोखरीमा ${whole}वटा कमलका पात छन्। तिनमा ${nWord}वटा भ्यागुता बसेका छन्।`,
      ask: "कतिवटा पात खाली छन्?",
      look: "फेरि हेर",
      miss: (chosen, n, sum, whole) => `${n} र ${chosen} मिलेर ${sum} हुन्छ। तर पात ${whole}वटा छन्।`,
      rows: (five) => `एउटा भरिएको लहरमा ${five}वटा हुन्छन्।`,
      hint: "लहरहरू हेर। खाली पातहरू खाली छन्।",
    },
    machen: {
      question: (whole, n) => `बाकसमा ${whole}वटा ओखर अट्छन्। ${n}वटा पहिले नै छन्। अझै जति अट्छन्, त्यति लेऊ!`,
      paw: "लोखर्केको हातमा भएको",
      take: "एउटा ओखर लेऊ",
      back: "ओखर फर्काऊ",
      pour: "भित्र!",
      tooFew: (k, word) => (k === 1 ? "एउटा प्वाल अझै खाली छ। अर्को एउटा लेऊ!" : `अझै ${word}वटा प्वाल खाली छन्।`),
      tooMany: (k, word) => (k === 1 ? "एउटा ओखर अब अट्दैन।" : `${word}वटा ओखर अब अट्दैनन्।`),
      hint: "खाली प्वालहरू गन।",
    },
    forschen: {
      question: "लहरहरू हेर। कुन सङ्ख्या छुट्यो?",
      questionTwenty: "माथि दश छ, तल बीस। कुन सङ्ख्या छुट्यो?",
      miss: (chosen) => `${chosen}ले पूरा भरिँदैन।`,
      missTwenty: (n, chosen, sum) => `${n} र ${chosen} मिलेर ${sum} हुन्छ।`,
      done: (whole) => `सधैँ एक बढी र एक कम। जम्मा ${whole} नै रहन्छ।`,
      doneTwenty: (a, b, n) => `${a} र ${b} मिलेर दश हुन्छ। त्यसैले ${n} र ${b} मिलेर बीस हुन्छ।`,
      hint: "एउटा सङ्ख्या ठूलो हुन्छ, अर्को सानो।",
      hintRows: "लहर-लहर हेर: बायाँ + १, दायाँ − १।",
      hintTwenty: (a, n) => `माथि हेर: ${a}लाई कति चाहिन्छ? ${n}लाई पनि उत्तिकै चाहिन्छ।`,
    },
    anwenden: {
      question: (n, whole) => `कुन सङ्ख्याले ${n}लाई ${whole} बनाउँछ?`,
      miss: (n, chosen, sum, whole) => `${n} र ${chosen} मिलेर ${sum} हुन्छ, ${whole} होइन।`,
      hint: "खाली ठाउँहरू अझै चाहिन्छन्।",
    },
    pruefen: {
      question: (a, b, whole) => `लाटोकोसेरो भन्छ: ${a} र ${b} मिलेर ${whole} हुन्छ। के यो ठिक हो?`,
      look: "हेर, कुनै ठाउँ खाली छ कि कुनै बढी भयो।",
      fix: (a, whole) => `हो, त्यो ठिक होइन। कुन सङ्ख्याले ${a}लाई ${whole} बनाउँछ?`,
      fixMiss: (whole) => `अझै भएन। जम्मा ${whole} हुनुपर्छ।`,
      hint: (whole) => `सबै ${whole}वटा ठाउँ भरिनुपर्छ, कुनै बढी होइन।`,
    },
  },
};
