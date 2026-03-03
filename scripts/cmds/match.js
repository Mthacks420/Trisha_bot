module.exports = {
  config: {
    name: "match",
    version: "2.0.0",
    author: "TawHid_Bbz",
    role: 0,
    category: "fun"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID } = event;
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const list = threadInfo.participantIDs;
      
      const id1 = list[Math.floor(Math.random() * list.length)];
      const id2 = list[Math.floor(Math.random() * list.length)];
      
      const name1 = (await api.getUserInfo(id1))[id1].name;
      const name2 = (await api.getUserInfo(id2))[id2].name;

      let msg = `╭━━━━『 𝗠𝗔𝗧𝗖𝗛𝗠𝗔𝗞𝗘𝗥 』━━━━╮\n`;
      msg += `│ 💞 𝗧𝗼𝗱𝗮𝘆'𝘀 𝗕𝗲𝘀𝘁 𝗖𝗼𝘂𝗽𝗹𝗲:\n`;
      msg += `│ ✨ ${name1} ❤️ ${name2}\n`;
      msg += `│ 🧛🏻‍♀️ "𝗗𝗼𝗻'𝘁 𝗣𝗹𝗮𝘆 𝗪𝗶𝘁𝗵 𝗠𝘆 𝗠𝗶𝗻𝗱,\n`;
      msg += `│    𝗖𝗮𝘂𝘀𝗲 𝗶𝘁'𝘀 𝗱𝗮𝗻𝗴𝗲𝗿𝗼𝘂𝘀!"\n`;
      msg += `╰━━━━━━━━━━━━━━━━━━━━╯`;
      return message.reply(msg);
    } catch (e) {
      return message.reply("গ্রুপের তথ্য নিতে সমস্যা হচ্ছে বেবি! 🌸");
    }
  }
};
