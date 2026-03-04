module.exports = {
    config: {
        name: "lovef",
        version: "1.7.0",
        author: "Tawhid Ahmed",
        countDown: 5,
        role: 0,
        description: {
            bn: "মেয়েদের ইমপ্রেস করার জন্য শর্ট ও রোমান্টিক প্রপোজ লেটার",
            en: "Short and romantic propose letters to impress girls"
        },
        category: "love",
        guide: {
            bn: "{pn} @mention / reply to message",
            en: "{pn} @mention / reply to message"
        }
    },

    onStart: async function ({ api, event, usersData }) {
        const { threadID, messageID, mentions, type, messageReply } = event;

        let mentionID;

        if (type === "message_reply") {
            mentionID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            mentionID = Object.keys(mentions)[0];
        } else {
            return api.sendMessage("⚠️ আরে সোনা, কোন রাজকুমারীকে প্রপোজ করবে তাকে মেনশন দাও বা রিপ্লাই করো! ✨", threadID, messageID);
        }

        try {
            const name = await usersData.getName(mentionID) || "প্রিয়তমা";

            // মেয়েদের ইমপ্রেস করার মতো স্পেশাল প্রপোজ লেটার
            const girlImpressLetters = [
                `প্রিয় ${name},\nজানিনা তোমার চোখে আমার গুরুত্ব কতটুকু, তবে আমার পুরো পৃথিবীটা এখন তোমাকে ঘিরেই। খুব ইচ্ছে করে তোমার প্রতিটি হাসির কারণ হতে। আমার রাজকুমারী হয়ে সারাজীবন পাশে থাকবে? 💍`,
                
                `${name},\nচাঁদের আলো হয়তো সবার কাছে সুন্দর, কিন্তু আমার কাছে তোমার ওই মায়াবী মুখের হাসিটাই পৃথিবীর সেরা সৌন্দর্য। এই হাতটা কি সারাজীবনের জন্য ধরা যায় না? ❤️`,
                
                `শুনো ${name},\nআমি হয়তো তোমার স্বপ্নের সেই রাজপুত্র নই, কিন্তু তোমাকে আগলে রাখার ইচ্ছাটা একদম পাহাড়ের মতো অটল। এক আকাশ ভালোবাসা দিলে কি আমার হবে? 🥀`,
                
                `প্রিয় ${name},\nহাজারো মানুষের ভিড়ে আমার চোখ শুধু তোমাকেই খুঁজে ফেরে। তোমার হাতটা ধরে আমি পৃথিবীর শেষ সীমানা পর্যন্ত হাঁটতে চাই। আমাদের কি একটা সুন্দর গল্প শুরু হতে পারে না? 💌`,
                
                `${name},\nতুমি আমার জীবনের সেই কবিতা যা আমি বারবার পড়তে চাই। আমার একঘেয়ে জীবনে তুমি কি বসন্ত হয়ে আসবে? তোমাকে খুব ভালোবাসি! 💞`
            ];

            const finalLetter = girlImpressLetters[Math.floor(Math.random() * girlImpressLetters.length)];

            const msg = `💍 [ 𝗣𝗿𝗼𝗽𝗼𝘀𝗲 𝗟𝗲𝘁𝘁𝗲𝗿 ] 💍\n━━━━━━━━━━━━━━━━━━\n\n${finalLetter}\n\n━━━━━━━━━━━━━━━━━━\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻\n👤 𝗠𝗮𝗶𝗻𝘁𝗮𝗶𝗻𝗲𝗱 𝗕𝘆: 𝓣𝓪𝔀𝓱𝓲𝓭 𝓐𝓱𝓶𝓮𝓭 💞`;

            return api.sendMessage(msg, threadID, messageID);

        } catch (err) {
            return api.sendMessage(`❌ এরর: ${err.message}`, threadID, messageID);
        }
    }
};
