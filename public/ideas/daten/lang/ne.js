// Sentences of the idea "daten" in this language. So far only the bag of balls and the weather chart, which came
// from the sunny rock with their translation; the rest comes in German until it is translated.

export default {
  daten: {
    forschen: {
      draw: "एउटा बल निकाल",
      colours: { red: "रातो", blue: "निलो", yellow: "पहेँलो", green: "हरियो" },
      same: "उत्तिकै पटक",
      chance: { sure: "निश्चित", maybe: "सम्भव", never: "असम्भव" },
      askMost: "कुन रङ सबैभन्दा धेरै पटक आउला? निकालेर हेर!",
      askChance: (c) => `नहेरी एउटा बल निकाल्छौ। ${c} बल: निश्चित, सम्भव कि असम्भव?`,
      missMost: "हरेक रङका बल गन।",
      missChance: { sure: "निश्चित भनेको: सधैँ आउँछ। के सबै बल त्यस्तै छन्?", maybe: "सम्भव भनेको: आउन सक्छ, तर नआउन पनि सक्छ।", never: "असम्भव भनेको: आउनै सक्दैन। के त्यस्तो बल छैन?" },
      doneMost: (c) => `धेरैजसो बल ${c} छन्। ${c} सबैभन्दा धेरै पटक आउला।`,
      doneSame: "दुवै उत्तिकै छन्: उत्तिकै पटक आउलान्।",
      doneChance: {
        sure: (c) => `सबै बल ${c} छन्: यो निश्चित हो।`,
        maybe: (c) => `${c} र अरू पनि छन्: यो सम्भव हो।`,
        never: (c) => `कुनै बल ${c} छैन: यो असम्भव हो।`,
      },
      hintMost: "बल अब रङअनुसार मिलाइएका छन्। कुन धेरै छन्?",
      hintChance: "बल अब रङअनुसार मिलाइएका छन्। कुन कुन रङ छन्?",
    },    anwenden: {
      chartTitle: "दुई हप्ताको मौसम",
      weather: { sun: "घाम", cloud: "बादल", rain: "पानी", snow: "हिउँ" },
      mostAsk: "कुन मौसम सबैभन्दा धेरै भयो?",
      mostMiss: "कुन लहर सबैभन्दा लामो छ, हेर।",
      mostDone: (w, n) => `सबैभन्दा धेरै ${w}: ${n} दिन।`,
      mostHint: "सबैभन्दा लामो लहर जित्छ।",
      countAsk: (w) => `कति दिन ${w} भयो?`,
      countMiss: "लहरका चित्र गन।",
      countDone: (w, n) => `${n} दिन ${w} भयो।`,
      countHint: "पट्टीको अन्त्यमुनिको अङ्क पढ।",
      diffAsk: (a, b) => `${b} भन्दा ${a} कति दिन बढी भयो?`,
      diffMiss: "दुई लहर तुलना गर: एउटा कति लामो छ?",
      diffSum: "त्यो त दुवै जोडेको भयो। सोधेको: कति बढी?",
      diffDone: (a, b, n) => `${b} भन्दा ${a} ${n} दिन बढी भयो।`,
      diffHint: "ठुलो सङ्ख्याबाट सानो घटाऊ।",
    },  },
};
