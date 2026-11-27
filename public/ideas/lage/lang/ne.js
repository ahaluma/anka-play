// Sätze/sentences of the idea "lage", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/lage/board.js) calls them with number words, as there.

export default {
  lage: {
    intro: {
      sehen: "को कहाँ छ? सही जनावर थिच।",
      machen: "जनावरलाई सही ठाउँमा राख।",
      forschen: "जनावर कहाँ छ? सही शब्द खोज।",
      anwenden: "जनावरहरू बेन्चमा बसेका छन्।",
      pruefen: "लाटोकोसेरोले जनावर कहाँ छ भन्छ। के त्यो ठिक हो?",
    },
    pets: {
      rabbit: ["खरायो", "खरायो"], cat: ["बिरालो", "बिरालो"], dog: ["कुकुर", "कुकुर"], bear: ["भालु", "भालु"],
      fox: ["फ्याउरो", "फ्याउरो"], frog: ["भ्यागुतो", "भ्यागुतो"], duck: ["हाँस", "हाँस"], mouse: ["मुसो", "मुसो"],
      pig: ["सुँगुर", "सुँगुर"], panda: ["पान्डा", "पान्डा"], lion: ["सिंह", "सिंह"],
    },
    words: { auf: "माथि", unter: "मुनि", neben: "छेउमा", vor: "अगाडि", hinter: "पछाडि", links: "बायाँ", rechts: "दायाँ" },
    where: {
      auf: "टेबलमाथि", unter: "टेबलमुनि", neben: "टेबलको छेउमा", links: "टेबलको बायाँपट्टि",
      rechts: "टेबलको दायाँपट्टि", vor: "टेबलको अगाडि", hinter: "टेबलको पछाडि",
    },
    to: {
      auf: "टेबलमाथि", unter: "टेबलमुनि", neben: "टेबलको छेउमा", links: "टेबलको बायाँपट्टि",
      rechts: "टेबलको दायाँपट्टि", vor: "टेबलको अगाडि", hinter: "टेबलको पछाडि",
    },
    sehen: {
      ask: (where) => `${where} को छ?`,
      miss: (pet, where) => `${pet} ${where} छ।`,
      done: (pet, where) => `${pet} ${where} छ।`,
      hint: (where) => `हेर, ${where} यहाँ हो।`,
    },
    machen: {
      ask: (pet, to) => `${pet}लाई ${to} राख!`,
      miss: (where) => `त्यो ${where} हो।`,
      done: (pet, where) => `अब ${pet} ${where} बसेको छ।`,
      hint: (where) => `हेर, ${where} यहाँ हो।`,
    },
    forschen: {
      ask: (pet) => `${pet} कहाँ छ?`,
      miss: (pet, where) => `के ${pet} साँच्चै ${where} छ? राम्ररी हेर।`,
      done: (pet, where) => `${pet} ${where} छ।`,
      hint: "चम्किरहेको जनावरलाई हेर। टेबलबाट हेर्दा त्यो कहाँ छ?",
    },
    anwenden: {
      between: (a, b) => `${a} र ${b}को बीचमा को बसेको छ?`,
      leftOf: (a) => `${a}को ठिक बायाँपट्टि को बसेको छ?`,
      rightOf: (a) => `${a}को ठिक दायाँपट्टि को बसेको छ?`,
      isBetween: (pet, a, b) => `${pet} ${a} र ${b}को बीचमा बसेको छ।`,
      isLeftOf: (pet, a) => `${pet} ${a}को ठिक बायाँपट्टि बसेको छ।`,
      isRightOf: (pet, a) => `${pet} ${a}को ठिक दायाँपट्टि बसेको छ।`,
      missNamed: (pet) => `त्यो प्रश्नमा भएको ${pet} हो। अर्को जनावर खोज।`,
      miss: "त्यहाँ को बसेको छ, फेरि हेर।",
      hintBetween: "चम्किरहेका दुई जनावर खोज। बीचमा को बसेको छ?",
      hintSide: "चम्किरहेको जनावर खोज। बायाँ भनेको तिम्रो देब्रे हात भएतिर हो: बुढी औंला र चोर औंलाले L बनाउँछ।",
    },
    pruefen: {
      question: (pet, where) => `लाटोकोसेरो भन्छ: ${pet} ${where} छ। के त्यो ठिक हो?`,
      right: (pet, where) => `हो, ${pet} ${where} छ।`,
      lookAgain: "जनावर कहाँ छ, फेरि राम्ररी हेर।",
      fix: (pet) => `हो, त्यो ठिक होइन। ${pet} साँच्चै कहाँ छ?`,
      fixMiss: (pet, where) => `के ${pet} साँच्चै ${where} छ?`,
      fixed: (pet, where) => `अब ठिक भयो: ${pet} ${where} छ।`,
      hint: "चम्किरहेको जनावरलाई हेर, अनि टेबललाई।",
    },
  },
};
