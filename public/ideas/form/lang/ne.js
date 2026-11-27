// Sätze/sentences of the idea "form", Nepali. Ported from think-lab (welt/lang/ne.js) as they were:
// the board (ideas/form/board.js) calls them with number words, as there.

export default {
  form: {
    intro: {
      sehen: "आकारहरू चिन्छौ? सही आकार थिच।",
      machen: "आकारहरूबाट चित्र बनाऊ।",
      forschen: "एउटै किसिमका सबै आकार खोज।",
      anwenden: "आकारहरू जताततै छन्। यो कुन आकारको हो?",
      pruefen: "उल्लुले आकारको नाम भन्छ। के त्यो ठिक हो?",
    },
    names: {
      kreis: { name: "गोलो", the: "गोलो", a: "गोलो", many: "गोलाहरू" },
      dreieck: { name: "त्रिभुज", the: "त्रिभुज", a: "त्रिभुज", many: "त्रिभुजहरू" },
      quadrat: { name: "वर्ग", the: "वर्ग", a: "वर्ग", many: "वर्गहरू" },
      rechteck: { name: "आयत", the: "आयत", a: "आयत", many: "आयतहरू" },
    },
    facts: {
      kreis: "गोलो पूरै गोलाकार हुन्छ, यसमा कुना हुँदैन।",
      dreieck: "त्रिभुजमा तीन कुना र तीन भुजा हुन्छन्।",
      quadrat: "वर्गमा चार कुना र चारवटै बराबर भुजा हुन्छन्, ढल्केको भए पनि।",
      rechteck: "आयतमा चार कुना हुन्छन्: दुई लामा र दुई छोटा भुजा।",
    },
    pictures: { haus: "घर", schneemann: "हिउँको मान्छे", baum: "रुख", eis: "आइसक्रिम", auto: "कार", boot: "डुङ्गा", rakete: "रकेट", roboter: "रोबोट", zug: "रेल" },
    things: { uhr: "घडी", keks: "बिस्कुट", donut: "डोनट", muenze: "सिक्का", pizza: "पिज्जाको टुक्रा", kaese: "चिजको टुक्रा", sandwich: "स्यान्डविच", segel: "पाल", fenster: "झ्याल", waffel: "वाफल", wuerfel: "पासाको एक भाग", tuer: "ढोका", buch: "किताब", brief: "चिठी", handy: "मोबाइल" },
    sehen: {
      ask: (the) => `${the} थिच!`,
      miss: (a, fact) => `यो ${a} हो। ${fact}`,
      done: (a, fact) => `यो ${a} हो। ${fact}`,
    },
    machen: {
      ask: (picture) => `${picture} बनाऊ! चम्किरहेको भागमा कुन आकार मिल्छ?`,
      next: "अब अर्को भाग।",
      miss: (a, fact) => `${a} यहाँ मिल्दैन। ${fact}`,
      done: (picture) => `सकियो! तिमीले ${picture} बनायौ।`,
      hint: (fact) => `चम्किरहेको भाग हेर। ${fact}`,
    },
    forschen: {
      ask: (many) => `सबै ${many} खोज!`,
      miss: (a, fact) => `यो ${a} हो। ${fact}`,
      done: (n, many) => `तिमीले सबै भेट्टायौ: ${n} ${many}।`,
      hint: "कुनै साना छन्, कुनै घुमेका छन्।",
    },
    anwenden: {
      ask: (thing) => `${thing} कुन आकारको छ?`,
      miss: (fact) => `${fact} के यो मिल्छ?`,
      done: (thing, a) => `${thing} ${a} जस्तै छ।`,
      hint: "किनारामा औंला डुलाऊ। कुना छन्? कतिवटा?",
    },
    pruefen: {
      question: (a) => `उल्लु भन्छ: यो ${a} हो। के त्यो ठिक हो?`,
      right: (a, fact) => `हो, यो ${a} हो। ${fact}`,
      lookAgain: (fact) => `${fact} के यहाँ त्यस्तै छ?`,
      isRight: (fact) => `फेरि हेर। ${fact}`,
      fix: "राम्रो ध्यान दियौ! यो आकारको नाम के हो?",
      fixMiss: (fact) => `${fact} के यो मिल्छ?`,
      fixed: (a) => `अब ठिक भयो: यो ${a} हो।`,
      hint: "कुना गन। सबै भुजा बराबर छन्?",
    },
  },
};
