const axios = require("axios");

const getBase = async () => {
        const res = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return res.data.mahmud;
};

module.exports = {
        config: {
                name: "imgur",
                aliases: ["i"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "যেকোনো ছবি বা ভিডিওকে Imgur লিঙ্কে রূপান্তর করুন",
                        en: "Convert any image or video into an Imgur link",
                        vi: "Chuyển đổi bất kỳ hình ảnh hoặc video nào thành liên kết Imgur"
                },
                category: "tools",
                guide: {
                        bn: '   {pn}: মিডিয়া ফাইলে রিপ্লাই দিয়ে ব্যবহার করুন',
                        en: '   {pn}: Reply to a media file to get the link',
                        vi: '   {pn}: Phản hồi tệp phương tiện để lấy liên kết'
                }
        },

        langs: {
                bn: {
                        noMedia: "🐤 | বেবি, একটি ছবি বা ভিডিওতে রিপ্লাই দাও! 🖼️",
                        success: "%1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noMedia: "🐤 | Baby, please reply to a media file (image/video)! 🖼️",
                        success: "%1",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noMedia: "🐤 | Cưng ơi, vui lòng phản hồi một tệp phương tiện! 🖼️",
                        success: "%1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (event.type !== "message_reply" || !event.messageReply.attachments.length) {
                        return message.reply(getLang("noMedia"));
                }

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        const attachmentUrl = encodeURIComponent(event.messageReply.attachments[0].url);
                        const baseUrl = await getBase();
                        const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/imgur?url=${attachmentUrl}`;

                        const response = await axios.get(apiUrl, { timeout: 100000 });

                        if (response.data.status && response.data.link) {
                                return message.reply({
                                        body: getLang("success", response.data.link)
                                }, () => {
                                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                                });
                        } else {
                                throw new Error("Imgur API response status false.");
                        }

                } catch (err) {
                        console.error("Imgur Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
