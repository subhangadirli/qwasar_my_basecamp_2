const Thread = require('../models/Thread');
const Message = require('../models/Message');

const threadsController = {
  async index(req, res) {
    try {
      const threads = await Thread.findByProject(req.params.id);
      res.json(threads);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async show(req, res) {
    try {
      const thread = await Thread.findByIdWithAuthor(req.params.threadId);
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      const messages = await Message.findByThread(thread.id);
      res.json({ ...thread, messages });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Thread title is required' });
    }
    try {
      const thread = await Thread.createThread(req.params.id, req.session.userId, title, body);
      res.status(201).json({ message: 'Thread created', thread });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Thread title is required' });
    }
    try {
      const thread = await Thread.findByIdWithAuthor(req.params.threadId);
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      await Thread.updateThread(thread.id, title, body);
      const updated = await Thread.findByIdWithAuthor(thread.id);
      res.json({ message: 'Thread updated', thread: updated });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    try {
      const thread = await Thread.findByIdWithAuthor(req.params.threadId);
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      await Thread.destroyById(thread.id);
      res.json({ message: 'Thread deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = threadsController;
