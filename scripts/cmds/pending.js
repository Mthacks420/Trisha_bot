const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pending",
    version: "1.5.0",
    role: 2,
    author: "TawHid_Bbz",
    description: "Approve pending groups with stylish join message",
    category: "system",
    guide: { en: "!pending [all/index]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;

    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]);
      const pending = spam.filter(group => group.isGroup && group.isSubscribed);

      if (pending.length === 0) return message.reply("বেবি, কোনো গ্রুপ পেন্ডিং নেই! ✨");

      if (args[0] === "all") {
        for (const group of pending) {
          await api.sendMessage("Checking group...", group.threadID);
          await this.sendJoinMessage(api, group.threadID);
        }
        return message.reply(`✅ অলরেডি ${pending.length} টি গ্রুপ অ্যাপ্রুভ করা হয়েছে!`);
      }

      const index = parseInt(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= pending.length) {
        let msg = "╭━━━━『 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 𝗟𝗜𝗦𝗧 』━━━━╮\n";
        pending.forEach((group, i) => {
          msg += `│ ${i + 1}. ${group.name} (${group.threadID})\n`;
        });
        msg += "╰━━━━━━━━━━━━━━━━━━━━╯\n💬 Type '!pending [index]' to approve.";
        return message.reply(msg);
      }

      const targetID = pending[index].threadID;
      await this.sendJoinMessage(api, targetID);
      return message.reply(`✅ গ্রুপ "${pending[index].name}" অ্যাপ্রুভ করা হয়েছে!`);

    } catch (e) {
      return message.reply("এরর হয়েছে বেবি! 🌸");
    }
  },

  sendJoinMessage: async function (api, threadID) {
    const imgURL = "https://i.postimg.cc/FsgKcGNb/New-Project-22-D0F2E9F.png";
    const path = __dirname + `/cache/join_${threadID}.png`;

    let msg = `┏━━━━━━━❖━━━━━━━┓\n`;
    msg += `   🔴 𝗦𝗬𝗦𝗧𝗘𝗠 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 🔴\n`;
    msg += `┗━━━━━━━❖━━━━━━━┛\n\n`;
    msg += `🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝗧𝗮𝘄𝗵𝗶𝗱_𝗕𝗯𝘇 𝗫\n`;
    msg += `👑 𝗢𝘄𝗻𝗲𝗿    : 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `⚙️ 𝗦𝘁𝗮𝘁𝘂𝘀   : 𝗢𝗻𝗹𝗶𝗻𝗲 & 𝗔𝗰𝘁𝗶𝘃𝗲 ✅\n`;
    msg += `🛡️ 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 : 𝗘𝗻𝗰𝗿𝘆𝗽𝘁𝗲𝗱 🔒\n`;
    msg += `⚡ 𝗣𝗿𝗲𝗳𝗶𝘅    : [ ! ]\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💬 𝗧𝘆𝗽𝗲 "!𝗵𝗲𝗹𝗽" 𝘁𝗼 𝘀𝗲𝗲 𝗺𝘆 𝗽𝗼𝘄𝗲𝗿!\n\n`;
    msg += `🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : fb.me/suhan420rx\n`;
    msg += `🧛🏻‍♀️ "𝖣𝗈𝗇't 𝖯𝗅𝖺𝗒 𝖶𝗂𝗍𝗁 𝖬𝗒 𝖬𝗂𝗇𝖽!"\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ 𝖤𝗇𝗃𝗈𝗒 𝖳𝗁𝖾 𝖯𝗋𝖾𝗆𝗂𝗎𝗆 𝖤𝗑𝗉𝖾𝗋𝗂𝖾𝗇𝖼𝖾!`;

    try {
      const response = await axios.get(imgURL, { responseType: 'arraybuffer' });
      fs.ensureDirSync(__dirname + '/cache');
      fs.writeFileSync(path, Buffer.from(response.data, 'binary'));

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path));
    } catch (e) {
      return api.sendMessage(msg, threadID);
    }
  }
};
