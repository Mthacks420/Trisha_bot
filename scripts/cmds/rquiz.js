module.exports = {
  config: {
    name: "rquiz",
    version: "2.1.0",
    author: "Tawhid Ahmed",
    moduleName: "Advanced spoofing",
    role: 0,
    description: "Ramadan Special Islamic Quiz",
    category: "game",
    guide: { en: "!rquiz" }
  },

  onStart: async function ({ api, event, message }) {
    const questions = [
      { q: "রমজান মাসের প্রধান ইবাদত কোনটি?", a: "রোজা" },
      { q: "কোন রাতে পবিত্র কুরআন নাজিল হয়েছে?", a: "লাইলাতুল কদর" },
      { q: "রোজা রাখার জন্য শেষ রাতে খাবার খাওয়াকে কী বলে?", a: "সেহরি" },
      { q: "সূর্য ডোবার পর রোজা ভাঙার খাবারকে কী বলে?", a: "ইফতার" },
      { q: "ইসলামের স্তম্ভ কয়টি?", a: "৫" },
      { q: "জান্নাতের কোন দরজা দিয়ে শুধু রোজাদাররা প্রবেশ করবে?", a: "রাইয়ান" },
      { q: "রমজানের শেষে যে উৎসব পালন করা হয় তার নাম কী?", a: "ঈদুল ফিতর" },
      { q: "সারা বিশ্বে মুসলিমরা কোন মাসে রোজা রাখে?", a: "রমজান" }
    ];

    const random = questions[Math.floor(Math.random() * questions.length)];
    const { threadID, messageID } = event;

    let msg = `╭━━━━『 𝗥𝗔𝗠𝗔𝗗𝗔𝗡 𝗤𝗨𝗜𝗭 』━━━━╮\n`;
    msg += `│ 📝 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${random.q}\n`;
    msg += `│ 🕌 "আল্লাহুম্মা ইন্নাকা আফুউন,\n`;
    msg += `│    তুহিব্বুল আফওয়া ফা’ফু আন্নি।"\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    msg += `💬 উত্তর দিতে এই মেসেজে রিপ্লাই দাও! ✨`;

    return api.sendMessage(msg, threadID, (err, info) => {
      if (global.GoatBot && global.GoatBot.onReply) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          answer: random.a
        });
      }
    }, messageID);
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { body } = event;
    const { answer, messageID } = Reply;

    if (body.trim().toLowerCase() === answer.toLowerCase()) {
      if (global.GoatBot && global.GoatBot.onReply) {
        global.GoatBot.onReply.delete(messageID);
      }
      return message.reply(`✅ মাশাআল্লাহ বেবি! তোমার উত্তর একদম সঠিক হয়েছে। আল্লাহ আমাদের সবাইকে রমজানের নেকি দান করুন। ✨`);
    } else {
      return message.reply(`❌ আফসোস বেবি! উত্তরটি সঠিক হয়নি। সঠিক উত্তর ছিল: "${answer}"। আবার চেষ্টা করো। 🌸`);
    }
  }
};
