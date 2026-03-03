const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "kill",
    version: "2.7.0",
    author: "Tawhid Ahmed",
    role: 0,
    description: "Kill someone with a horror image (Reply/Mention Support)",
    category: "fun",
    guide: { en: "!kill @mention OR !kill [reply]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, mentions, messageReply, senderID } = event;
    
    // ID Selection Logic: Reply > Mention > Sender
    let victimID;
    if (messageReply) {
      victimID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      victimID = Object.keys(mentions)[0];
    } else {
      victimID = senderID;
    }
    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    const filePath = path.join(cacheDir, `kill_${victimID}_${Date.now()}.png`);

    const avatarURL = `https://graph.facebook.com/${victimID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // High Quality Scary APIs (No simple pics!)
    const servers = [
      `https://api.popcat.xyz/gun?image=${encodeURIComponent(avatarURL)}`,
      `https://pencuri-api.vercel.app/api/canvas/horror?url=${encodeURIComponent(avatarURL)}`,
      `https://api.popcat.xyz/clown?image=${encodeURIComponent(avatarURL)}`
    ];

    let success = false;
    message.reply("অপেক্ষা করো বেবি, কলিজা কাঁপানো দৃশ্য তৈরি করছি... 🔪🩸");

    for (const url of servers) {
      if (success) break;
      try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
        fs.writeFileSync(filePath, Buffer.from(res.data, 'binary'));
        success = true;
      } catch (e) {
        continue;
      }
    }

    if (success) {
      let msg = `╭━━━━『 𝗞𝗜𝗟𝗟 𝗠𝗢𝗗𝗘 』━━━━╮\n`;
      msg += `│ 🧛🏻‍♀️ "𝗗𝗼𝗻'𝘁 𝗣𝗹𝗮𝘆 𝗪𝗶𝘁𝗵 𝗠𝘆 𝗠𝗶𝗻𝗱,\n`;
      msg += `│    𝗖𝗮𝘂𝘀𝗲 𝗶𝘁'𝘀 𝗱𝗮𝗻𝗴𝗲𝗿𝗼𝘂𝘀!"\n`;
      msg += `╰━━━━━━━━━━━━━━━━━━━━╯`;

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);
    } else {
      return message.reply("বেবি, কিলাররা এখন ছুটিতে আছে! পরে ট্রাই করো। 🌸");
    }
  }
};
