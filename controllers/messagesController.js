const Message = require('../models/Message');
const Thread = require('../models/Thread');

function canModify(req, message) {
  return (
    message.author_id === req.session.userId ||
    (req.project && req.project.owner_id === req.session.userId) ||
    req.session.isAdmin
  );
}

const messagesController = {
  async create(req, res) {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    try {
      const thread = await Thread.findByIdWithAuthor(req.params.threadId);
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      const message = await Message.createMessage(thread.id, req.session.userId, body);
      res.status(201).json({ message: 'Message posted', data: message });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    try {
      const message = await Message.findById(req.params.messageId);
      if (!message || message.thread_id !== parseInt(req.params.threadId)) {
        return res.status(404).json({ error: 'Message not found' });
      }
      if (!canModify(req, message)) {
        return res.status(403).json({ error: 'You do not have permission for this action' });
      }
      await Message.updateMessage(message.id, body);
      res.json({ message: 'Message updated' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    try {
      const message = await Message.findById(req.params.messageId);
      if (!message || message.thread_id !== parseInt(req.params.threadId)) {
        return res.status(404).json({ error: 'Message not found' });
      }
      if (!canModify(req, message)) {
        return res.status(403).json({ error: 'You do not have permission for this action' });
      }
      await Message.destroyById(message.id);
      res.json({ message: 'Message deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = messagesController;
