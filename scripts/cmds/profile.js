const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "profile",
    version: "2.5.0",
    author: "TawHid_Bbz",
    role: 0,
    category: "info"
  },

  onStart: async function ({ api, event, usersData, message }) {
    const { threadID, senderID, mentions, messageReply } = event;
    let id = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : (messageReply ? messageReply.senderID : senderID);
    
    const info = await usersData.get(id);
    const name = info.name || "User";
    const ava = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    
    // Multiple Server List
    const servers = [
      `https://api.popcat.xyz/welcomecard?background=https://i.ibb.co/XS95S9B/dark-bg.jpg&text1=${encodeURIComponent(name)}&text2=ID:%20${id}&text3=TawHid_Bbz%20Bot&avatar=${encodeURIComponent(ava)}`,
      `https://pencuri-api.vercel.app/api/canvas/welcomecard?name=${encodeURIComponent(name)}&id=${id}&avatar=${encodeURIComponent(ava)}`,
      `https://rest-api.xyz/api/canvas/welcome?name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(ava)}`
    ];

    const path = __dirname + `/cache/profile_${id}.png`;
    let success = false;

    for (let url of servers) {
      if (success) break;
      try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 8000 });
        fs.ensureDirSync(__dirname + '/cache');
        fs.writeFileSync(path, Buffer.from(res.data, 'binary'));
        success = true;
      } catch (e) { continue; }
    }

    if (success) {
      return api.sendMessage({
        body: `╭━━━━『 𝗨𝗦𝗘𝗥 𝗖𝗔𝗥𝗗 』━━━━╮\n│ 👤 𝗡𝗮𝗺𝗲: ${name}\n│ 🆔 𝗜𝗗: ${id}\n│ 🧛🏻‍♀️ "𝗗𝗼𝗻'𝘁 𝗣𝗹𝗮𝘆 𝗪𝗶𝘁𝗵 𝗠𝘆 𝗠𝗶𝗻𝗱,\n│    𝗖𝗮𝘂𝘀𝗲 𝗶𝘁'𝘀 𝗱𝗮𝗻𝗴𝗲𝗿𝗼𝘂𝘀!"\n╰━━━━━━━━━━━━━━━━━━━━╯`,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path));
    } else {
      return message.reply("বেবি, সব কার্ড সার্ভার এখন ডাউন! পরে ট্রাই করো। 🌸");
    }
  }
};
