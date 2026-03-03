const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "hypnotize",
    version: "1.0.0",
    role: 0,
    author: "TawHid_Bbz",
    description: "Hypnotize a member",
    category: "fun"
  },

  onStart: async function ({ api, event, message, usersData }) {
    const { threadID, messageID, mentions } = event;
    const targetID = Object.keys(mentions)[0] || event.senderID;
    const targetName = await usersData.getName(targetID);

    const imgURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const spiralURL = `https://api.popcat.xyz/distort?image=${encodeURIComponent(imgURL)}`; 
    const path = __dirname + `/cache/hypno_${targetID}.png`;

    try {
      const response = await axios.get(spiralURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(response.data, 'binary'));

      let msg = `╭━━━『 𝗛𝗬𝗣𝗡𝗢𝗧𝗜𝗭𝗘𝗗 』━━━╮\n`;
      msg += `│ 🌀 Target: ${targetName}\n`;
      msg += `│ 💀 "Look into my eyes..."\n`;
      msg += `│ 🧛🏻‍♀️ You are under my control now!\n`;
      msg += `╰━━━━━━━━━━━━━━━━━━╯\n`;
      msg += `✨ 𝖣𝗈𝗇'𝗍 𝖯𝗅𝖺𝗒 𝖶𝗂𝗍𝗁 𝖬𝗒 𝖬𝗂𝗇𝖽!`;

      return api.sendMessage({ body: msg, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (e) {
      return message.reply("বেবি, Tawhid baby এর সাথে কন্টাক্ট করো। 💀");
    }
  }
};
