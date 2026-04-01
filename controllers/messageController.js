const messageService = require("../services/messageService");

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(
      req.user.id,
      req.params.userId,
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const data = await messageService.getConversations(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    await messageService.deleteConversation(req.user.id, req.params.userId);

    res.json({ message: "Conversation Deleted" });
  } catch (error) {
    next(error);
  }
};
