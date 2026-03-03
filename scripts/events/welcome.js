const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

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
                    // ১. ডাটা কালেকশন
                    const threadInfo = await threadsData.get(threadID);
                    const threadName = threadInfo.threadName || "Our Group";
                    const userName = await usersData.getName(userID) || "New Member";
                    const memberCount = threadInfo.members.length;

                    // ২. ক্যানভাস সেটআপ (Premium Resolution)
                    const canvas = createCanvas(1200, 600);
                    const ctx = canvas.getContext("2d");

                    // ৩. ডার্ক প্রিমিয়াম ব্যাকগ্রাউন্ড
                    const bgUrl = "https://i.imgur.com/vHq0L98.jpeg"; // একটি সুন্দর অ্যাবস্ট্রাক্ট ব্যাকগ্রাউন্ড
                    const background = await loadImage(bgUrl);
                    ctx.drawImage(background, 0, 0, 1200, 600);

                    // ওভারলে (ঝাপসা কালো পর্দা যাতে লেখা ফুটে ওঠে)
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(0, 0, 1200, 600);

                    // ৪. প্রোফাইল পিকচার ড্রয়িং (সাদা বর্ডারসহ)
                    const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                    const avatar = await loadImage(avatarUrl);

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(600, 200, 150, 0, Math.PI * 2, true);
                    ctx.lineWidth = 15;
                    ctx.strokeStyle = "#ffffff";
                    ctx.stroke();
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatar, 450, 50, 300, 300);
                    ctx.restore();

                    // ৫. টেক্সট স্টাইলিং (Premium Look)
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#ffffff";

                    // নাম (বোল্ড গোল্ডেন কালার)
                    ctx.font = "bold 70px Arial";
                    const gradient = ctx.createLinearGradient(0, 0, 1200, 0);
                    gradient.addColorStop(0, "#FFD700");
                    gradient.addColorStop(1, "#FFA500");
                    ctx.fillStyle = gradient;
                    ctx.fillText(userName.toUpperCase(), 600, 420);

                    // ওয়েলকাম মেসেজ
                    ctx.font = "40px Arial";
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(`WELCOME TO ${threadName.toUpperCase()}`, 600, 480);

                    // মেম্বার সংখ্যা
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "#00FFCC";
                    ctx.fillText(`YOU ARE OUR ${memberCount}th MEMBER ✨`, 600, 540);

                    // ৬. ফাইল সেন্ড করা
                    const cachePath = path.join(__dirname, "cache", `welcome_${userID}.png`);
                    if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));
                    
                    fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

                    const msg = {
                        body: `🌸 WELLCOME BABY 😗✌️, ${userName}!\n\n💖 আমাদের "${threadName}" গ্রুপে আপনাকে পেয়ে আমরা অনেক খুশি।\n🎀 আপনি আমাদের ${memberCount} তম মেম্বার। ভালো থাকবেন আমাদের সাথে! ✨`,
                        attachment: fs.createReadStream(cachePath)
                    };

                    api.sendMessage(msg, threadID, () => {
                        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                    });

                } catch (err) {
                    console.error("Welcome Event Error:", err);
                }
            }
        }
    }
};
