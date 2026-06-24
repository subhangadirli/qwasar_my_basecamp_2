const Thread = require('../models/Thread');
const Message = require('../models/Message');

const threadsController = {
  index(req, res) {
    Thread.findByProject(req.params.id, (err, threads) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(threads);
    });
  },

  show(req, res) {
    Thread.findById(req.params.threadId, (err, thread) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      Message.findByThread(thread.id, (err, messages) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ ...thread, messages });
      });
    });
  },

  create(req, res) {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Thread title is required' });
    }
    Thread.create(req.params.id, req.session.userId, title, body, (err, thread) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.status(201).json({ message: 'Thread created', thread });
    });
  },

  update(req, res) {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Thread title is required' });
    }
    Thread.findById(req.params.threadId, (err, thread) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      Thread.update(thread.id, title, body, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        Thread.findById(thread.id, (err, updated) => {
          if (err) return res.status(500).json({ error: 'Server error' });
          res.json({ message: 'Thread updated', thread: updated });
        });
      });
    });
  },

  destroy(req, res) {
    Thread.findById(req.params.threadId, (err, thread) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!thread || thread.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      Thread.destroy(thread.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Thread deleted' });
      });
    });
  }
};

module.exports = threadsController;
