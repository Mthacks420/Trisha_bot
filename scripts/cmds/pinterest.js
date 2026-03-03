const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "pin",
                aliases: ["pinterest", "pic"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "পিন্টারেস্ট থেকে যেকোনো ছবি সার্চ করে ডাউনলোড করুন",
                        en: "Search and download images from Pinterest",
                        vi: "Tìm kiếm và tải xuống hình ảnh từ Pinterest"
                },
                category: "image gen",
                guide: {
                        bn: '   {pn} <নাম> - <পরিমাণ>: (যেমন: {pn} goku - 10)',
                        en: '   {pn} <query> - <amount>: (Ex: {pn} goku - 10)',
                        vi: '   {pn} <từ khóa> - <số lượng>: (VD: {pn} goku - 10)'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, কী ছবি খুঁজছো? নাম ও পরিমাণ দাও! 🔍\nউদাহরণ: {pn} goku - 10",
                        noData: "× দুঃখিত, আপনার সার্চ অনুযায়ী কোনো ছবি পাওয়া যায়নি।",
                        success: "✅ | আপনার জন্য \"%1\" এর %2টি ছবি এখানে রয়েছে:",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please enter a search query and amount! 🔍\nExample: {pn} goku - 10",
                        noData: "× Sorry, no images found for your query.",
                        success: "✅ | Here are your %2 images for \"%1\":",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, hãy nhập từ khóa và số lượng! 🔍\nVD: {pn} goku - 10",
                        noData: "× Rất tiếc, không tìm thấy hình ảnh nào.",
                        success: "✅ | Đây là %2 hình ảnh cho \"%1\":",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const queryAndLength = args.join(" ").split("-");
                const keySearch = queryAndLength[0]?.trim();
                const count = queryAndLength[1]?.trim();
                const numberSearch = count ? Math.min(parseInt(count), 20) : 6;

                if (!keySearch) return message.reply(getLang("noInput"));

                const cacheDir = path.join(__dirname, "cache");
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const apiUrl = await mahmud();
                        const response = await axios.get(
                                `${apiUrl}/api/pin/mahmud?query=${encodeURIComponent(keySearch)}&limit=${numberSearch}`
                        );

                        const data = response.data.images;
                        if (!data || data.length === 0) {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return message.reply(getLang("noData"));
                        }

                        const attachments = [];
                        for (let i = 0; i < data.length; i++) {
                                const imgRes = await axios.get(data[i], { responseType: "arraybuffer" });
                                const imgPath = path.join(cacheDir, `pin_${Date.now()}_${i}.jpg`);
                                await fs.outputFile(imgPath, imgRes.data);
                                attachments.push(fs.createReadStream(imgPath));
                        }

                        await message.reply({
                                body: getLang("success", keySearch, attachments.length),
                                attachment: attachments
                        }, () => {
                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                attachments.forEach(att => {
                                        if (fs.existsSync(att.path)) fs.unlinkSync(att.path);
                                });
                        });

                } catch (err) {
                        console.error("Pinterest Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
