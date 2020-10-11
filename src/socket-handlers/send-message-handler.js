const BaseHandler = require("./base-handler");
const { ChatModel, MessageModel } = require("../database/modles");

class SendMessageHandler extends BaseHandler {
  static get name() {
    return "send-message";
  }

  async onRequest(data) {
    if (!this.socket.user) return;

    const { chatId, text } = data;

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      throw new Error("chat not found");
    }

    const message = MessageModel.craete({
      chat: chat._id,
      creator: this.socket.user._id,
      text: text
    });

    this.socket.to(chat._id).emit("new-message", message);
    this.socket.emit("new-message", message);
  }
}

module.exports = SendMessageHandler;
