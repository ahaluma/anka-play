// "अङ्क जोडी" का वाक्यहरू, नेपाली। v = मानहरू, h = सहयोगी (h.w(3) = "तीन")।
export default {
  memory: {
    intro: { spielen: "अङ्क जोडी! मिल्ने जोडी खोज।" },
    spielen: {
      ask: "मिल्ने अङ्क र चित्र खोज!",
      card: (v, h) => (v.kind === "number" ? h.w(v.n) : v.n === 1 ? h.thing(v.thing).one : `${h.w(v.n)}वटा ${h.thing(v.thing).many}`),
      match: (v, h) => `मिल्यो! ${h.w(v.n)}।`,
      miss: "यो मिलेन।",
      right: "सबै जोडी भेटियो!",
      hint: "एउटा अङ्कमा थिच। अनि त्यति नै चित्र भएको कार्ड खोज।",
    },
  },
};
