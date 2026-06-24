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
  create(req, res) {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    Thread.findById(req.params.threadId, (err, thread) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      Message.create(thread.id, req.session.userId, body, (err, message) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.status(201).json({ message: 'Message posted', data: message });
      });
    });
  },

  update(req, res) {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    Message.findById(req.params.messageId, (err, message) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!message || message.thread_id !== parseInt(req.params.threadId)) {
        return res.status(404).json({ error: 'Message not found' });
      }
      if (!canModify(req, message)) {
        return res.status(403).json({ error: 'You do not have permission for this action' });
      }
      Message.update(message.id, body, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Message updated' });
      });
    });
  },

  destroy(req, res) {
    Message.findById(req.params.messageId, (err, message) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!message || message.thread_id !== parseInt(req.params.threadId)) {
        return res.status(404).json({ error: 'Message not found' });
      }
      if (!canModify(req, message)) {
        return res.status(403).json({ error: 'You do not have permission for this action' });
      }
      Message.destroy(message.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Message deleted' });
      });
    });
  }
};

module.exports = messagesController;
