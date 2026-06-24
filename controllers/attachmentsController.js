const path = require('path');
const fs = require('fs');
const Attachment = require('../models/Attachment');
const { uploadsDir, formatOf } = require('../config/upload');

const attachmentsController = {
  index(req, res) {
    Attachment.findByProject(req.params.id, (err, attachments) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(attachments);
    });
  },

  create(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    Attachment.create({
      project_id: parseInt(req.params.id),
      uploader_id: req.session.userId,
      filename: req.file.filename,
      original_name: req.file.originalname,
      format: formatOf(req.file.originalname),
      size: req.file.size
    }, (err, attachment) => {
      if (err) {
        fs.unlink(path.join(uploadsDir, req.file.filename), () => {});
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ message: 'File added', attachment });
    });
  },

  download(req, res) {
    Attachment.findById(req.params.attachmentId, (err, attachment) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!attachment || attachment.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'File not found' });
      }
      const filePath = path.join(uploadsDir, attachment.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.download(filePath, attachment.original_name);
    });
  },

  destroy(req, res) {
    Attachment.findById(req.params.attachmentId, (err, attachment) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!attachment || attachment.project_id !== parseInt(req.params.id)) {
        return res.status(404).json({ error: 'File not found' });
      }
      Attachment.destroy(attachment.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        fs.unlink(path.join(uploadsDir, attachment.filename), () => {});
        res.json({ message: 'Fayl silindi' });
      });
    });
  }
};

module.exports = attachmentsController;
