const BaseHandler = require("./base-handler");
const { ChatModel } = require("../database/models");

class CreateChathandler extends BaseHandler {
  static get name() {
    return "craete-chat";
  }

  async onRequest(data) {
    if (!this.socket.user) return;

    const { name } = data;

    let chat = await ChatModel.findOne({
      name
    });

    if (!chat) {
      chat = new ChatModel({
        creator: this.socket.user._id,
        name
      });
    }

    const isGuest = chat.users.some(
      (userId) => userId === this.socket.user._id
    );

    if (chat.creator !== this.socket.user._id && !isGuest) {
      chat.users.push(this.socket.user._id);
    }

    await chat.save();

    this.socket.join(chat._id);

    this.socket.emit("new-chat", { chatId: chat._id });
  }
}

module.exports = CreateChathandler;
