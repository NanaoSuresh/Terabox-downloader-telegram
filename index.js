async function main() {
const axios = require('axios');

// Your API key (Bot token)
const apiKey = "7354249291:AAH3IyBMpHC0CCdrhA8VDcEjhP3u3fs0PNU";

// The message you want to send
const message = "Hello, world!";

// The chat ID of the recipient
const chatId = "<recipient_chat_id>";

// URL for sending the message
const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
async function sendMessage() {
    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message
        });
        console.log("Message sent successfully!", response.data);
    } catch (error) {
        console.error("Failed to send message:", error.response ? error.response.data : error.message);
    }
}

// Run the sendMessage function
sendMessage();


  
  const { Telegraf, Markup } = require("telegraf");
  const { getDetails } = require("./api");
  const { sendFile } = require("./utils");
  const express = require("express");

  // Replace 'YOUR_BOT_TOKEN_HERE' with your actual bot token
  const bot = new Telegraf('7354249291:AAH3IyBMpHC0CCdrhA8VDcEjhP3u3fs0PNU');

  bot.start(async (ctx) => {
    try {
      ctx.reply(
        `Hi ${ctx.message.from.first_name},\n\nI can Download Files from Terabox.\n\nMade with ❤️ by @botcodes123\n\nSend any terabox link to download.`,
        Markup.inlineKeyboard([
          Markup.button.url(" Channel", "https://t.me/botcodes123"),
          Markup.button.url("Report bug", "https://t.me/Armanidrisi_bot"),
        ]),
      );
    } catch (e) {
      console.error("Error in bot.start:", e);
    }
  });

  bot.on("message", async (ctx) => {
    if (ctx.message && ctx.message.text) {
      const messageText = ctx.message.text;
      console.log("Received message:", messageText);

      if (
        messageText.includes("terabox.com") ||
        messageText.includes("teraboxapp.com")
      ) {
        const parts = messageText.split("/");
        const linkID = parts[parts.length - 1];
        console.log("Extracted link ID:", linkID);

        ctx.reply(linkID);

        try {
          const details = await getDetails(messageText);
          console.log("Details received:", details);

          if (details && details.direct_link) {
            ctx.reply("Sending Files Please Wait.!!");
            sendFile(details.direct_link, ctx);
          } else {
            ctx.reply('Something went wrong 🙃');
          }
        } catch (e) {
          console.error("Error in getDetails or sendFile:", e);
        }
      } else {
        ctx.reply("Please send a valid Terabox link.");
      }
    } else {
      //ctx.reply("No message text found.");
    }
  });

  const app = express();
  // Set the bot API endpoint
  app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_URL }));

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server started on port ${port}`));
}

main();
