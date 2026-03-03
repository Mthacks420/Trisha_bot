module.exports.config = {
    name: "prefix",
    version: "1.0.8",
    hasPermssion: 0,
    credits: "Tawhid Ahmed",
    description: "বটের প্রিক্স এবং আপটাইম চেক করার কমান্ড",
    commandCategory: "System",
    usages: "prefix",
    cooldowns: 5
};

module.exports.handleEvent = async function({ api, event, Threads }) {
    var { threadID, messageID, body } = event;
    if (!body) return;
    
    // শুধু 'prefix' বা 'Prefix' লিখলে কাজ করবে
    if (body.toLowerCase() === "prefix") {
        const axios = require("axios");
        
        // প্রিক্স বের করার সেফ মেথড
        let threadSetting = (await Threads.getData(threadID)).settings || {};
        let prefix = threadSetting.PREFIX || global.config.PREFIX;

        // আপটাইম ক্যালকুলেশন
        const time = process.uptime();
        const hours = Math.floor(time / (60 * 60));
        const minutes = Math.floor((time % (60 * 60)) / 60);
        const seconds = Math.floor(time % 60);

        const imageUrl = "https://i.postimg.cc/FsgKcGNb/New-Project-22-D0F2E9F.png";

        try {
            const res = await axios.get(imageUrl, { responseType: "stream" });
            return api.sendMessage({
                body: `╭─────────────╮\n   ✨ 𝗧𝗮𝘄𝗵𝗶𝗱 𝗕𝗯𝘇 𝗕𝗼𝘁 ✨\n╰─────────────╯\n\n` +
                      `╔════════════════╗\n` +
                      `  🌐 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: 「 ${global.config.PREFIX} 」\n` +
                      `  🛸 𝗖𝗵𝗮𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: 「 ${prefix} 」\n` +
                      `  ⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}𝗵 ${minutes}𝗺 ${seconds}𝘀\n` +
                      `╚════════════════╝\n\n` +
                      `👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n` +
                      `🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻\n\n` +
                      `💡 𝗨𝘀𝗲 [ ${prefix}help ] 𝘁𝗼 𝘀𝗲𝗲 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀!`,
                attachment: res.data
            }, threadID, messageID);
        } catch (e) {
            return api.sendMessage(`🌐 Prefix: ${global.config.PREFIX}\n⏳ Uptime: ${hours}h ${minutes}m ${seconds}s\n🎀 Assistant: Nezuko Chan`, threadID, messageID);
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    // এটি খালি থাকবে কারণ handleEvent সব কাজ করে দিচ্ছে।
};
