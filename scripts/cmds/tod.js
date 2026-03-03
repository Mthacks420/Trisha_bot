const axios = require("axios");

module.exports = {
  config: {
    name: "tod",
    author: "TawHid_Bbz",
    role: 0,
    category: "game"
  },

  onStart: async function ({ message, args }) {
    const type = args[0] ? args[0].toLowerCase() : "random";
    const fallback = ["নিজের কোনো সিক্রেট বলো?", "কাকে সবথেকে বেশি ভালোবাসো?", "বটকে একবার কিস করো!", "কাউকে প্রপোজ করো!"];
    
    try {
      const res = await axios.get(`https://api.popcat.xyz/tod`, { timeout: 5000 });
      var quest = res.data.truth || res.data.dare;
    } catch (e) {
      var quest = fallback[Math.floor(Math.random() * fallback.length)];
    }

    let msg = `╭━━━━『 𝗧𝗥𝗨𝗧𝗛/𝗗𝗔𝗥𝗘 』━━━━╮\n`;
    msg += `│ 📝 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${quest}\n`;
    msg += `│ 🧛🏻‍♀️ "𝗗𝗼𝗻'𝘁 𝗣𝗹𝗮𝘆 𝗪𝗶𝘁𝗵 𝗠𝘆 𝗠𝗶𝗻𝗱,\n`;
    msg += `│    𝗖𝗮𝘂𝘀𝗲 𝗶𝘁'𝘀 𝗱𝗮𝗻𝗴𝗲𝗿𝗼𝘂𝘀!"\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━━╯`;
    return message.reply(msg);
  }
};
