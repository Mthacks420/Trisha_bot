const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "pair",
        version: "2.1.0",
        author: "Tawhid Ahmed", // credits renamed to author for consistency
        countDown: 10,
        role: 0,
        description: {
            bn: "গ্রুপের মেম্বারদের মধ্যে জোড়া মেলান",
            en: "Randomly pair with a group member"
        },
        category: "love",
        guide: {
            bn: '{pn}: আপনার জোড়া খুঁজতে ব্যবহার করুন',
            en: '{pn}: Use to find your pair'
        }
    },

    onStart: async function ({ api, event, usersData }) {
        const { threadID, messageID, senderID } = event;

        try {
            // ১. গ্রুপের সব মেম্বার লিস্ট নেওয়া
            let threadInfo = await api.getThreadInfo(threadID);
            var listMember = threadInfo.participantIDs;
            
            // ২. নিজেকে বাদ দিয়ে অন্য কাউকে সিলেক্ট করা
            var partnerID = listMember[Math.floor(Math.random() * listMember.length)];
            while (partnerID == senderID) {
                partnerID = listMember[Math.floor(Math.random() * listMember.length)];
            }

            // ৩. ইউজার ডাটা থেকে নাম নেওয়া
            const nameSender = await usersData.getName(senderID) || "Facebook User";
            const namePartner = await usersData.getName(partnerID) || "Facebook User";

            // ৪. প্রোফাইল পিকচার API (Using path logic)
            const cachePath = __dirname + `/cache/pair_${senderID}.png`;
            const pairUrl = `https://api.popcat.xyz/ship?user1=https://graph.facebook.com/${senderID}/picture?width=512&user2=https://graph.facebook.com/${partnerID}/picture?width=512`;

            api.sendMessage(`✨ [ 𝗣𝗮𝗶𝗿𝗶𝗻𝗴... ] ✨\n━━━━━━━━━━━━━━━━━━\n💞 খুঁজছি তোমার মনের মানুষকে... একটু অপেক্ষা করো বেবি!`, threadID, messageID);

            let res = await axios.get(pairUrl, { responseType: "arraybuffer" });
            fs.ensureDirSync(__dirname + '/cache'); // Ensure cache folder exists
            fs.writeFileSync(cachePath, Buffer.from(res.data, "utf-8"));

            const msg = {
                body: `╭─────────────╮\n   ❣️ 𝗠𝗮𝘁𝗰𝗵 𝗠𝗮𝗱𝗲! ❣️\n╰─────────────╯\n\n` +
                      `🌸 𝗡𝗮𝗺𝗲: ${nameSender}\n` +
                      `🌸 𝗣𝗮𝗿𝘁𝗻𝗲𝗿: ${namePartner}\n\n` +
                      `✨ আমাদের হিসেবে তোমরা একে অপরের জন্য ${Math.floor(Math.random() * 30) + 70}% পারফেক্ট! ✨\n\n` +
                      `👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n` +
                      `🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`,
                attachment: fs.createReadStream(cachePath)
            };

            return api.sendMessage(msg, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);

        } catch (err) {
            console.error(err);
            return api.sendMessage(`❌ এরর এসেছে সোনা: ${err.message}`, threadID, messageID);
        }
    }
};
