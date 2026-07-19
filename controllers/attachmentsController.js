const path = require('path');
const fs = require('fs');
const Attachment = require('../models/Attachment');
const { uploadsDir, formatOf } = require('../config/upload');

const attachmentsController = {
  async index(req, res) {
    try {
      const attachments = await Attachment.findByProject(req.params.id);
      res.json(attachments);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    try {
      const attachment = await Attachment.createAttachment({
        project_id: parseInt(req.params.id),
        uploader_id: req.session.userId,
        filename: req.file.filename,
        original_name: req.file.originalname,
        format: formatOf(req.file.originalname),
        size: req.file.size
      });
      res.status(201).json({ message: 'File added', attachment });
    } catch (err) {
      fs.unlink(path.join(uploadsDir, req.file.filename), () => {});
      res.status(500).json({ error: 'Server error' });
    }
  },

  async download(req, res) {
    try {
      const attachment = await Attachment.findById(req.params.attachmentId);
      if (!attachment || attachment.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'File not found' });
      }
      const filePath = path.join(uploadsDir, attachment.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.download(filePath, attachment.original_name);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    try {
      const attachment = await Attachment.findById(req.params.attachmentId);
      if (!attachment || attachment.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'File not found' });
      }
      await Attachment.destroyById(attachment.id);
      fs.unlink(path.join(uploadsDir, attachment.filename), () => {});
      res.json({ message: 'File deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = attachmentsController;
