const axios = require("axios");

const mahmud = [
        "baby",
        "bby",
        "babu",
        "bbu",
        "jan",
        "bot",
        "জান",
        "জানু",
        "বেবি",
        "wifey",
        "hinata"
       ];

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "hinata",
                aliases: ["baby", "bby", "bbu", "jan", "janu", "wifey", "bot"],
                version: "1.8",
                author: "MahMUD",
                countDown: 2,
                role: 0,
                description: {
                        bn: "হিনাতা এআই এর সাথে চ্যাট করুন এবং তাকে নতুন কিছু শেখান",
                        en: "Chat with Hinata AI and teach her new things",
                        vi: "Trò chuyện with Hinata AI and teach her new things"
                },
                category: "chat",
                guide: {
                        bn: '   {pn} [মেসেজ] - চ্যাট করতে\n   {pn} teach [প্রশ্ন] - [উত্তর] - শেখাতে\n   {pn} msg [প্রশ্ন] - উত্তর খুঁজতে\n   {pn} edit [প্রশ্ন] - [নতুন উত্তর] - এডিট করতে\n   {pn} remove [প্রশ্ন] - [ইনডেক্স] - ডিলিট করতে\n   {pn} list/list all - টিচার লিস্ট দেখতে',
                        en: '   {pn} [msg] - to chat\n   {pn} teach [q] - [a] - to teach\n   {pn} msg [q] - search reply\n   {pn} edit [q] - [new_a] - to edit\n   {pn} remove [q] - [index] - to remove\n   {pn} list/list all - to see teachers',
                        vi: '   {pn} [tn] - để trò chuyện\n   {pn} teach [h] - [tl] - để dạy\n   {pn} msg [h] - tìm kiếm câu trả lời\n   {pn} edit [h] - [tl_mới] - để sửa\n   {pn} remove [h] - [số] - để xóa\n   {pn} list/list all - để xem danh sách'
                }
        },

        langs: {
                bn: {
                        noInput: "বলো বেবি😘",
                        teachUsage: "❌ | সঠিক নিয়ম: teach [প্রশ্ন] - [উত্তর]",
                        teachSuccess: "✅ উত্তর যুক্ত হয়েছে: \"%1\" -> \"%2\"\n• টিচার: %3\n• মোট ডাটা: %4",
                        removeUsage: "❌ | সঠিক নিয়ম: remove [প্রশ্ন] - [ইনডেক্স]",
                        editUsage: "❌ | সঠিক নিয়ম: edit [প্রশ্ন] - [নতুন উত্তর]",
                        editSuccess: "✅ সফলভাবে এডিট করা হয়েছে!\n• প্রশ্ন: \"%1\"\n• নতুন উত্তর: \"%2\"",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Format: teach [question] - [answer]",
                        teachSuccess: "✅ Reply added: \"%1\" -> \"%2\"\n• Teacher: %3\n• Total: %4",
                        removeUsage: "❌ | Format: remove [question] - [index]",
                        editUsage: "❌ | Format: edit [question] - [new answer]",
                        editSuccess: "✅ Successfully edited!\n• Q: \"%1\"\n• New A: \"%2\"",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "Bolo baby😘",
                        teachUsage: "❌ | Định dạng: teach [câu hỏi] - [câu trả lời]",
                        teachSuccess: "✅ Đã thêm câu trả lời: \"%1\" -> \"%2\"\n• Giáo viên: %3\n• Tổng số: %4",
                        removeUsage: "❌ | Định dạng: remove [câu hỏi] - [số]",
                        editUsage: "❌ | Định dạng: edit [câu hỏi] - [câu trả lời mới]",
                        editSuccess: "✅ Đã sửa thành công!\n• H: \"%1\"\n• TL mới: \"%2\"",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, usersData, getLang, commandName }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) return api.sendMessage("Unauthorized author change.", event.threadID);

                const uid = event.senderID;
                if (!args[0]) return api.sendMessage(getLang("noInput"), event.threadID, (err, info) => {
                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                }, event.messageID);

                try {
                        const baseUrl = await baseApiUrl();
                        const action = args[0].toLowerCase();

                        if (action === "teach") {
                                const input = args.slice(1).join(" ");
                                const [trigger, ...responsesArr] = input.split(" - ");
                                const responses = responsesArr.join(" - ");
                                if (!trigger || !responses) return api.sendMessage(getLang("teachUsage"), event.threadID, event.messageID);
                                const res = await axios.post(`${baseUrl}/api/jan/teach`, { trigger, responses, userID: uid });
                                const name = await usersData.getName(uid);
                                return api.sendMessage(getLang("teachSuccess", trigger, responses, name, res.data.count), event.threadID, event.messageID);
                        }

                        if (action === "edit") {
                                const input = args.slice(1).join(" ");
                                const [oldTrigger, ...newArr] = input.split(" - ");
                                const newResponse = newArr.join(" - ");
                                if (!oldTrigger || !newResponse) return api.sendMessage(getLang("editUsage"), event.threadID, event.messageID);
                                await axios.put(`${baseUrl}/api/jan/edit`, { oldTrigger, newResponse });
                                return api.sendMessage(getLang("editSuccess", oldTrigger, newResponse), event.threadID, event.messageID);
                        }

                        if (action === "remove") {
                                const input = args.slice(1).join(" ");
                                const [trigger, index] = input.split(" - ");
                                if (!trigger || !index || isNaN(index)) return api.sendMessage(getLang("removeUsage"), event.threadID, event.messageID);
                                const res = await axios.delete(`${baseUrl}/api/jan/remove`, { data: { trigger, index: parseInt(index) } });
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        if (action === "msg") {
                                const searchTrigger = args.slice(1).join(" ");
                                if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID);
                                try {
                                        const response = await axios.get(`${baseUrl}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
                                        return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
                                } catch (error) {
                                        const errorMessage = error.response?.data?.error || error.message || "error";
                                        return api.sendMessage(errorMessage, event.threadID, event.messageID);
                                }
                        }

                        if (action === "list") {
                                const endpoint = args[1] === "all" ? "/list/all" : "/list";
                                const res = await axios.get(`${baseUrl}/api/jan${endpoint}`);
                                if (args[1] === "all") {
                                        let message = "👑 List of Hinata Teachers:\n\n";
                                        const data = Object.entries(res.data.data).sort((a, b) => b[1] - a[1]).slice(0, 50);
                                        for (let i = 0; i < data.length; i++) {
                                                const [uID, count] = data[i];
                                                const name = await usersData.getName(uID) || "User";
                                                message += `${i + 1}. ${name}: ${count}\n`;
                                        }
                                        return api.sendMessage(message, event.threadID, event.messageID);
                                }
                                return api.sendMessage(res.data.message, event.threadID, event.messageID);
                        }

                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: args.join(" "), style: 3, attachments: event.attachments || [] });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: uid });
                        }, event.messageID);

                } catch (err) {
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        },

        onReply: async function ({ api, event, commandName }) {
                try {
                        const baseUrl = await baseApiUrl();
                        const res = await axios.post(`${baseUrl}/api/hinata`, { 
                                text: event.body?.toLowerCase() || "hi", 
                                style: 3, 
                                attachments: event.attachments || [] 
                        });
                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                        }, event.messageID);
                } catch (err) { console.error(err); }
        },

        onChat: async function ({ api, event, commandName }) {
                const message = event.body?.toLowerCase() || "";
                if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
                        api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        const randomReplies = [
                                "babu khuda lagse🥺",
                                "Hop beda😾,Bou  বল bou 😼",
                                "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",                      
                                "naw amr boss k message daw m.me/suhan420rx",
                                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
                                "এটায় দেখার বাকি সিলো_🙂🙂🙂",
                                "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
                                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
                                "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
                                "__বেশি বেবি বললে কামুর দিমু 🤭🤭",
                                "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
                                "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
                                "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
                                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, Tawhid ,Tawhid ও তো করতে পারো😑?",
                                "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
                                "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
                                "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
                                "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                                "খাওয়া দাওয়া করসো 🙄",
                                "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
                                "আরে আমি মজা করার mood এ নাই😒",
                                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
                                "আরে Bolo আমার জান, কেমন আসো? 😚",
                                "একটা BF খুঁজে দাও 😿",
                                "oi mama ar dakis na pilis 😿",
                                "amr JaNu lagbe,Tumi ki single aso?",
                                "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
                                "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
                                "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                                "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
                                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
                                "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
                                "বলো কি করতে পারি তোমার জন্য 😚",
                                "কথা দেও আমাকে পটাবা...!! 😌",
                                "বার বার Disturb করেছিস কোনো, আমার জানু Tawhid এর সাথে ব্যাস্ত আসি 😋",
                                "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
                                "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
                                "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
                                "আজকে আমার mন ভালো নেই 🙉",
                                "আমি হাজারো মশার Crush😓",
                                "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
                                "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
                                "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"  
                        ];
                    
                        const msgParts = message.trim().split(/\s+/);
                        if (msgParts.length === 1 && event.attachments.length === 0) {
                                const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                                return api.sendMessage(reply, event.threadID, (err, info) => {
                                        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                }, event.messageID);
                        } else {
                                let userText = message;
                                for (const p of mahmud) { if (message.startsWith(p)) { userText = message.substring(p.length).trim(); break; } }
                                try {
                                        const baseUrl = await baseApiUrl();
                                        const res = await axios.post(`${baseUrl}/api/hinata`, { text: userText, style: 3, attachments: event.attachments });
                                        return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                                                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                                        }, event.messageID);
                                } catch (e) { console.error(e); }
                        }
                }
        }
};
