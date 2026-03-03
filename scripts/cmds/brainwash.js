module.exports = {
    config: {
        name: "brainwash",
        version: "2.2.0",
        author: "Tawhid Ahmed",
        countDown: 5,
        role: 0,
        description: {
            bn: "কাউকে মেনশন দিয়ে বা রিপ্লাই দিয়ে ফানি ব্রেইনওয়াশ করার কমান্ড",
            en: "Brainwash someone by mention or reply"
        },
        category: "fun",
        guide: {
            bn: "{pn} @mention / reply to message",
            en: "{pn} @mention / reply to message"
        }
    },

    onStart: async function ({ api, event, usersData }) {
        const { threadID, messageID, mentions, type, messageReply } = event;

        let mentionID;

        // ১. রিপ্লাই বা মেনশন থেকে আইডি নেওয়া
        if (type === "message_reply") {
            mentionID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            mentionID = Object.keys(mentions)[0];
        } else {
            return api.sendMessage("⚠️ আরে সোনা, কাকে ব্রেইনওয়াশ করবে তাকে মেনশন দাও অথবা তার মেসেজে রিপ্লাই করো! 🙄", threadID, messageID);
        }

        try {
            const name = await usersData.getName(mentionID) || "User";

            const lines = [
                `🧠 [ 𝗕𝗿𝗮𝗶𝗻𝘄𝗮𝘀𝗵𝗶𝗻𝗴 𝗦𝘁𝗮𝗿𝘁𝗲𝗱 ] 🧠\n━━━━━━━━━━━━━━━━━━\n🌀 ${name}, তোমার মাথার ভেতরে জং ধরা নাট-বল্টু পরিষ্কার করা হচ্ছে...`,
                `🧼 সাবান আর হুইল পাউডার দিয়ে ${name}-এর মগজ ধোলাই চলছে... উফ্! কত ময়লা! thuuu 🤧🤢`,
                `💾 ${name}-এর পুরনো আবর্জনা মেমোরি ডিলিট করা হচ্ছে... [████████▒▒] 𝟴𝟬%`,
                `🚫 Warning! ${name}-এর মাথায় বুদ্ধির বদলে শুধু গোবর পাওয়া গেছে! সেটি সরানো হচ্ছে...`,
                `✨ সফলভাবে ব্রেইনওয়াশ করা হয়েছে! এখন ${name} নিজেকে Tawhid Ahmed-এর পাখি মনে করছে! 🌸😙`,
                `🎀 এখন থেকে ${name} আর আজেবাজে চিন্তা করবে না, শুধু বটের কথা শুনবে!😾`,
                `✅ 𝗗𝗼𝗻𝗲! ${name} এখন একদম নতুনের মতো রিফ্রেশড! কিন্তু বুদ্ধি আর ফিরে আসলো না... 🙂`
            ];

            await api.sendMessage(`🔄 ${name}-নড়াচড়া করো না, তোমার ব্রেইনওয়াশ করা হচ্ছে 😗`, threadID, messageID);

            // একে একে মেসেজ পাঠানোর লজিক (Loop)
            for (const line of lines) {
                // ২.৫ সেকেন্ড অপেক্ষা
                await new Promise(resolve => setTimeout(resolve, 5500));
                api.sendMessage(line, threadID);
            }

            // ফাইনাল মেসেজ
            return setTimeout(() => {
                api.sendMessage(`🎊 অভিনন্দন ${name}! তোমার ব্রেইন এখন একদম ক্লিন!\n━━━━━━━━━━━━━━━━━━\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`, threadID);
            }, 3000);

        } catch (err) {
            return api.sendMessage(`❌ এরর এসেছে সোনা: ${err.message}`, threadID, messageID);
        }
    }
};
