const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "stalk",
    version: "1.0.0",
    role: 0,
    author: "TawHid_Bbz",
    description: "Stalk someone deeply",
    category: "psycho",
    guide: { en: "{pn} @mention" }
  },

  onStart: async function ({ api, event, message, usersData }) {
    const { threadID, messageID, mentions } = event;
    let stalkID = Object.keys(mentions)[0];

    if (!stalkID) stalkID = event.senderID; // কাউকে মেনশন না করলে নিজেকে স্টলক করবে

    const stalkName = await usersData.getName(stalkID);
    const imgURL = `https://graph.facebook.com/${stalkID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    const stalkMsgs = [
      "আমি সব জানি... তুমি কোথায় যাচ্ছো, কার সাথে কথা বলছো। 🧛🏻‍♀️",
      "তোমার প্রতিটা ক্লিক, প্রতিটা মেসেজ... আমি দেখছি। 🔪",
      "পালানোর চেষ্টা করো না, আমি তোমার ছায়ার চেয়েও কাছে। 🩸",
      "Don't Play With My Mind! I'm watching you. 💀"
    ];
    const randomMsg = stalkMsgs[Math.floor(Math.random() * stalkMsgs.length)];

    const path = __dirname + `/cache/stalk_${stalkID}.png`;
    // এই API টি ছবিকে একটি অদ্ভুত গ্লিচ বা নজরদারি এফেক্ট দেবে
    const glitchURL = `https://api.popcat.xyz/glitch?image=${encodeURIComponent(imgURL)}`; 

    try {
      const response = await axios.get(glitchURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(response.data, 'binary'));

      let msg = `╭━━━━『 𝗦𝗧𝗔𝗟𝗞𝗘𝗥 𝗫 』━━━━╮\n`;
      msg += `│ 👁️ Target: ${stalkName}\n`;
      msg += `│ 💀 Status: ${randomMsg}\n`;
      msg += `╰━━━━━━━━━━━━━━━━━━━━╯\n`;
      msg += `✨ 𝖣𝗈𝗇'𝗍 𝖯𝗅𝖺𝗒 𝖶𝗂𝗍𝗁 𝖬𝗒 𝖬𝗂𝗇𝖽!`;

      return api.sendMessage({ body: msg, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (e) {
      return message.reply("বেবি, Tawhid baby এর সাথে কন্টাক্ট করো। 💀");
    }
  }
};
