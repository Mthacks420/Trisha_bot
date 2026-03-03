const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "murgi",
                aliases: ["chicken", "মুরগি"],
                version: "2.0.0",
                author: "TawHid_Bbz", 
                countDown: 10,
                role: 0,
                description: {
                        bn: "কাউকে মুরগি বানিয়ে চরম পঁচানি দিন",
                        en: "Make someone a murgi (hen) with Sigma style"
                },
                category: "fun",
                guide: {
                        bn: '{pn} <@tag/reply/UID>: কাউকে মুরগি বানাতে ট্যাগ বা রিপ্লাই করুন'
                }
        },

        langs: {
                bn: {
                        noTarget: "⚠️ আরে সোনা, কাকে মুরগি বানাবে? তাকে মেনশন দাও অথবা রিপ্লাই করো! 🐓",
                        success: "🐔 [ 𝗠𝘂𝗿𝗴𝗶 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱 ] 🐔\n━━━━━━━━━━━━━━━━━━\n✨ এই নাও সোনা, তোমার আজকের স্পেশাল রোস্ট! একে এখনই জবাই করা উচিত! 😂\n\n🔥 সিগমা রুল: বেশি কথা বললে মানুষ তাকে মুরগি বানিয়ে ছেড়ে দেয়! 😼\n\n👤 𝗢𝘄𝗻𝗲𝗿: 𝗧𝗮𝘄𝗵𝗶𝗱 𝗔𝗵𝗺𝗲𝗱\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻",
                        error: "❌ এরর এসেছে বেবি! মুরগিটা মনে হয় পালিয়ে গেছে: %1"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                // Author Lock Removed for Tawhid Ahmed
                const { mentions, messageReply, threadID, messageID } = event;
                let id;

                if (Object.keys(mentions).length > 0) {
                        id = Object.keys(mentions)[0];
                } else if (messageReply) {
                        id = messageReply.senderID;
                } else if (args[0] && !isNaN(args[0])) {
                        id = args[0];
                }

                if (!id) return message.reply(getLang("noTarget"));

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
                const filePath = path.join(cacheDir, `murgi_${id}.png`);

                try {
                        api.setMessageReaction("🐓", messageID, () => {}, true);
                        
                        const baseUrl = await baseApiUrl();
                        const url = `${baseUrl}/api/murgi?user=${id}`;

                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Murgi Error:", err);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
