const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Attachment = require('../models/Attachment');
const { uploadsDir } = require('../config/upload');

const projectsController = {
  index(req, res) {
    Project.getAll((err, projects) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(projects);
    });
  },

  show(req, res) {
    Project.findById(req.params.id, (err, project) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    });
  },

  create(req, res) {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    Project.create(name, description, req.session.userId, (err, project) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      ProjectMember.add(project.id, req.session.userId, 'admin', () => {
        res.status(201).json({ message: 'Project created successfully', project });
      });
    });
  },

  update(req, res) {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    Project.update(req.params.id, name, description, (err) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      Project.findById(req.params.id, (err, project) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Project updated successfully', project });
      });
    });
  },

  destroy(req, res) {
    Attachment.findByProject(req.params.id, (err, attachments) => {
      const files = err ? [] : attachments;
      files.forEach((a) => {
        fs.unlink(path.join(uploadsDir, a.filename), () => {});
      });
      Project.destroy(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json({ message: 'Project deleted' });
      });
    });
  }
};

module.exports = projectsController;