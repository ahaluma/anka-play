// Privacy policy (English translation). The German version is the binding one.
// c = CONTACT from ../contact.js
export default {
  title: "Privacy",
  updated: (date) => `Last updated: ${date}`,
  note: "This is a translation. The German version is the binding one.",
  sections: (c) => [
    {
      h: "In short",
      list: [
        "AnkaPlay is free and needs no account and no e-mail address.",
        "No advertising, no analytics or tracking tools, no cookies, no purchases.",
        "No third-party services: all files (pages, images, program code) come from this website itself. No fonts, libraries or content are loaded from other servers.",
        "Game progress stays on your device only and is never sent to us.",
      ],
    },
    // Shown only when contact.js has at least one detail.
    (c.name || c.address || c.email || c.phone) && {
      h: "Controller",
      p: [
        "The controller responsible for data processing on this website under the General Data Protection Regulation (GDPR) is:",
        [c.name, c.address, c.email && `e-mail: ${c.email}`, c.phone && `phone: ${c.phone}`].filter(Boolean).join(", "),
      ],
    },
    {
      h: "Hosting by Cloudflare",
      p: [
        "The website is delivered by Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. When a page is opened, Cloudflare processes technically necessary data that every browser sends automatically: IP address, date and time, the address requested, browser and device type (user agent). This data is needed to deliver the pages and to protect the website against attacks.",
        "The legal basis is Art. 6(1)(f) GDPR. Our legitimate interest is a secure and working website.",
        "We do not store any server logs ourselves and have not switched on any Cloudflare analytics. Cloudflare may process data in the USA. Cloudflare is certified under the EU-US Data Privacy Framework. A data processing agreement (Data Processing Addendum) with the EU Commission's standard contractual clauses is in place with Cloudflare. More information: Cloudflare's privacy policy at cloudflare.com/privacypolicy.",
      ],
    },
    {
      h: "Storage on your device",
      p: [
        "So that your child carries on at the right place next time, AnkaPlay stores in the browser's storage (localStorage) on your device: the chosen language and which station was visited last; the children you add (a first name or nickname, the age with the day it was entered, the chosen animal, whether texts are read aloud); and for each child separately: the level at each station, whether the last tasks were right at the first try, the stars, the number of rounds, the number of right and wrong answers per day (for 60 days), common kinds of mistakes, which sums already sit firmly, the thinking-trick cards collected, the answers to the questions on the first visit to a station and whether you opened the mountain.",
        "This data never leaves your device. We cannot see it. These are not cookies. For a name, it is best to enter only a first name or nickname.",
        "So that AnkaPlay also works without internet, the browser also keeps copies of this website's files on your device (service worker and cache). These are only pages, images and program code, nothing about you or your child.",
        "The legal basis is Section 25(2) no. 2 TDDDG (German Telecommunications Digital Services Data Protection Act), because the storage is strictly necessary for the function you asked for (carrying on, playing without internet, progress report).",
        "To delete it: on the parents' page (“Parents” button on the start page) tap “Delete progress” or delete a child, or delete the website data in your browser settings.",
      ],
    },
    {
      h: "Backup as a file",
      p: [
        "On the parents' page you can save all this data as a file and load it again on another device. The file is made on your device and saved where you choose. AnkaPlay sends it nowhere. Where you keep the file and who you give it to is up to you.",
      ],
    },
    {
      h: "Reading aloud and sounds",
      p: [
        "The games read text aloud with the speech output built into your browser or operating system (Web Speech API). Nothing is sent to our server for this. Depending on your device and settings, the provider of your operating system or browser (e.g. Google or Apple) may use online voices. We have no influence on this. Where available, AnkaPlay chooses a voice that works on the device itself. Sounds are generated directly in the browser.",
      ],
    },
    {
      h: "Children",
      p: [
        "AnkaPlay is made for children and is therefore deliberately minimal: no registration, no photos, no advertising, no purchases, no chat, no links to social networks. A child's name that you enter stays on your device. We do not collect personal data from children. We recommend that parents accompany their children while playing.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing based on legitimate interests (Art. 21). Please contact the operator of this website. As game progress is only on your device, you can view it, take it with you as a file and delete it yourself at any time.",
        "You can also complain to a data protection supervisory authority, for example the Hamburg Commissioner for Data Protection and Freedom of Information (datenschutz-hamburg.de).",
      ],
    },
    {
      h: "Changes",
      p: ["If AnkaPlay changes, we will update this policy. The version published here applies."],
    },
  ],
};
