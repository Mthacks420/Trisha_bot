const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
    config: {
        name: "welcome",
        author: "Tawhid Ahmed"
    },

    onStart: async function ({ api, event, usersData, threadsData }) {
        if (event.logMessageType === "log:subscribe") {
            const { threadID } = event;
            const { addedParticipants } = event.logMessageData;

            for (let participant of addedParticipants) {
                const userID = participant.userFbId;
                if (userID === api.getCurrentUserID()) continue;

                try {
                    // ১. ডাটা সংগ্রহ
                    const threadInfo = await threadsData.get(threadID) || {};
                    const threadName = threadInfo.threadName || "Our Group";
                    const userName = await usersData.getName(userID) || "New Member";
                    const memberCount = (threadInfo.members || []).length;

                    // ২. ক্যানভাস সেটআপ (1200x600 HD)
                    const canvas = createCanvas(1200, 600);
                    const ctx = canvas.getContext("2d");

                    // ৩. প্রিমিয়াম ডার্ক ব্যাকগ্রাউন্ড (লিঙ্ক নষ্ট হলেও চলবে)
                    try {
                        const bgUrl = "https://i.imgur.com/vHq0L98.jpeg";
                        const background = await loadImage(bgUrl);
                        ctx.drawImage(background, 0, 0, 1200, 600);
                    } catch (e) {
                        ctx.fillStyle = "#0f0f0f"; // Fallback Dark
                        ctx.fillRect(0, 0, 1200, 600);
                    }

                    // ৪. মেম্বার প্রোফাইল পিকচার (White Glow Effect)
                    const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const avatar = await loadImage(avatarUrl);

                    ctx.save();
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = "white";
                    ctx.beginPath();
                    ctx.arc(600, 200, 150, 0, Math.PI * 2, true);
                    ctx.lineWidth = 12;
                    ctx.strokeStyle = "#ffffff";
                    ctx.stroke();
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 450, 50, 300, 300);
                    ctx.restore();

                    // ৫. স্টাইলিশ টেক্সট ড্রয়িং
                    ctx.textAlign = "center";

                    // Welcome Baby (Stylish Text)
                    ctx.font = "bold 55px Arial";
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText("ＷＥＬＣＯＭＥ  ＢＡＢＹ", 600, 420);

                    // ইউজার নেম (Gradient Golden)
                    const gradient = ctx.createLinearGradient(0, 430, 0, 500);
                    gradient.addColorStop(0, "#FFD700");
                    gradient.addColorStop(1, "#FFA500");
                    ctx.font = "bold 75px Arial";
                    ctx.fillStyle = gradient;
                    ctx.fillText(userName.toUpperCase(), 600, 490);

                    // গ্রুপ নেম ও মেম্বার কাউন্ট
                    ctx.font = "35px Arial";
                    ctx.fillStyle = "#00FFCC";
                    ctx.fillText(`Group: ${threadName} | Member: #${memberCount}`, 600, 550);

                    // ৬. ক্যাশ হ্যান্ডেলিং
                    const cacheDir = path.join(__dirname, "cache");
                    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                    const cachePath = path.join(cacheDir, `welcome_${userID}.png`);
                    
                    fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

                    // ৭. মেসেজ সেন্ড (Stylish Owner Name)
                    const msg = {
                        body: `✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗕𝗮𝗯𝘆, ${userName}! ✨\n━━━━━━━━━━━━━━━━━━\n💖 আমাদের "${threadName}" গ্রুপে আপনাকে পেয়ে আমরা ধন্য।\n🎀 আপনি আমাদের ${memberCount} তম মেম্বার। ভালো থাকবেন বেবি! 🥀\n━━━━━━━━━━━━━━━━━━\n👤 𝗢𝘄𝗻𝗲𝗿: 𝓣𝓪𝔀𝓱𝓲𝓭 𝓐𝓱𝓶𝓮𝓭\n🎀 𝗔𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁: 𝗡𝗲𝘇𝘂𝗸𝗼 𝗖𝗵𝗮𝗻`,
                        attachment: fs.createReadStream(cachePath)
                    };

                    return api.sendMessage(msg, threadID, () => {
                        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                    });

                } catch (err) {
                    console.error("Welcome Double Check Error:", err);
                }
            }
        }
    }
};
