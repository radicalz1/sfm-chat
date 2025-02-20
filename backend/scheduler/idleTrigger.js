const Chat = require('../models/Chat');
const Message = require('../models/Message');

// This function should be invoked on a schedule (e.g., every minute) via your cloud provider's scheduler.
// It checks for chats with no new messages for over 5 minutes and (for example) logs an event or triggers AI analysis.
module.exports = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000);
    const idleChats = await Chat.find().populate('latestMessage');
    idleChats.forEach(async (chat) => {
      if (chat.latestMessage && chat.latestMessage.timestamp < fiveMinutesAgo) {
        console.log(`Chat ${chat._id} is idle. Triggering AI analysis...`);
        // Insert your AI analysis logic here.
      }
    });
  } catch (err) {
    console.error("Error during idle check:", err);
  }
};
