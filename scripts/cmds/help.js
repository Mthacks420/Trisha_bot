const axios = require("axios");
const fs = require("fs-extra");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.0.0",
    author: "TawHid_Bbz",
    countDown: 5,
    role: 0,
    category: "system",
    guide: {
      en: "{pn} [command name]",
      bn: "{pn} [কমান্ডের নাম]",
      vi: "{pn} [tên lệnh]"
    }
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID, messageID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
    
    // ল্যাঙ্গুয়েজ কোড ডিটেক্ট করা
    const langCode = threadData.data.lang || global.GoatBot.config.language || "en";

    const imageURL = "https://i.postimg.cc/wBP96zvR/1772328019906.jpg"; 
    const path = __dirname + "/cache/help_pic.jpg";

    if (args.length === 0) {
      const categories = {};
      let msg = "╭━━━━━━━━━━━━━╮\n";
      msg += "    🧛🏻‍♀️ 𝗧𝗔𝗪𝗛𝗜𝗗 𝗕𝗕𝗭 𝗕𝗢𝗧 🧛🏻‍♀️\n";
      msg += "╰━━━━━━━━━━━━━╯\n\n";

      for (const [name, value] of commands) {
        if (value.config.role > 0 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        if (!categories[category].commands.includes(name)) {
          categories[category].commands.push(name);
        }
      }

      Object.keys(categories).sort().forEach((cat) => {
        msg += `┌───╼ ⋆『 ${cat.toUpperCase()} 』\n`;
        msg += `│ ❯ ${categories[cat].commands.sort().join(", ")}\n`;
        msg += `└────────────────╼\n\n`;
      });

      const totalCommands = commands.size;
      const isBn = langCode === "bn";
      
      msg += `╭─────────────╮\n`;
      msg += `│ 📊 ${isBn ? "মোট কমান্ড" : "Total Cmds"}: ${totalCommands}\n`;
      msg += `│ 👤 ${isBn ? "এডমিন" : "Admin"}: TawHid Ahmed\n`;
      msg += `│ 💀 𝖣𝗈𝗇'𝗍 𝖯𝗅𝖺𝗒 𝖶𝗂𝗍𝗁 𝖬𝗒 𝖬𝗂𝗇𝖽!\n`;
      msg += `╰─────────────╯\n`;
      msg += `✨ ${isBn ? `টিপস: [ ${prefix}help নাম ] বিস্তারিত দেখুন` : `Tip: [ ${prefix}help name ] for details`}`;

      try {
        const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
        fs.ensureDirSync(__dirname + "/cache/");
        fs.writeFileSync(path, Buffer.from(response.data, 'binary'));
        
        const helpMsg = await message.reply({
          body: msg,
          attachment: fs.createReadStream(path)
        });
        
        // ৮০ সেকেন্ড পর মেসেজটি আনসেন্ট হবে (তুমি চাইলে সময় কমাতে পারো)
        setTimeout(() => message.unsend(helpMsg.messageID), 80000);
        if (fs.existsSync(path)) fs.unlinkSync(path);

      } catch (e) {
        return message.reply(msg);
      }

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        const notFound = langCode === "bn" ? `❌ | বেবি, "${commandName}" নামে কোনো কমান্ড নেই!` : `❌ | Command "${commandName}" not found!`;
        return message.reply(notFound);
      }

      const config = command.config;
      const roleText = roleTextToString(config.role, langCode);

      const labels = {
        bn: { name: "নাম", info: "তথ্য", desc: "কাজ", author: "লেখক", guide: "ব্যবহার", ver: "ভার্সন", role: "অনুমতি" },
        en: { name: "NAME", info: "INFO", desc: "Desc", author: "Author", guide: "Usage", ver: "Version", role: "Role" }
      };

      const lb = labels[langCode] || labels.en;
      const desc = config.description?.[langCode] || config.description?.en || "Secret Command!";
      
      // গাইড হ্যান্ডলিং
      let guide = config.guide?.[langCode] || config.guide?.en || "";
      guide = guide.replace(/{pn}/g, prefix + config.name).replace(/{p}/g, prefix).replace(/{n}/g, config.name);

      const detailMsg = `╭───『 ${isBn ? "কমান্ড তথ্য" : "COMMAND INFO"} 』───\n` +
                        `│ 🏷️ ${lb.name}: ${config.name}\n` +
                        `│ 📝 ${lb.desc}: ${desc}\n` +
                        `│ 👤 ${lb.author}: ${config.author || "TawHid_Bbz"}\n` +
                        `│ 📖 ${lb.guide}: ${guide || prefix + config.name}\n` +
                        `│ ⭐ ${lb.ver}: ${config.version || "1.0"}\n` +
                        `│ ♻️ ${lb.role}: ${roleText}\n` +
                        `╰─────────────────────╼`;

      const detailReply = await message.reply(detailMsg);
      setTimeout(() => message.unsend(detailReply.messageID), 80000);
    }
  }
};

function roleTextToString(role, lang) {
  const roles = {
    bn: ["সব ইউজার", "গ্রুপ অ্যাডমিন", "বোট অ্যাডমিন", "ডেভেলপার (Dev)", "ভিআইপি (VIP)", "NSFW ইউজার"],
    en: ["All users", "Group Admin", "Bot Admin", "Developer", "VIP User", "NSFW User"]
  };
  const r = roles[lang] || roles.en;
  return role >= 0 && role <= 5 ? `${role} (${r[role]})` : `${role} (Unknown)`;
}
