const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const Attachment = require('../models/Attachment');
const { uploadsDir } = require('../config/upload');

const projectsController = {
  async index(req, res) {
    try {
      const projects = await Project.getAll();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async show(req, res) {
    try {
      const project = await Project.findByIdWithOwner(req.params.id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async create(req, res) {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    try {
      const project = await Project.createProject(name, description, req.session.userId);
      await ProjectMember.add(project.id, req.session.userId, 'admin');
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    try {
      await Project.updateProject(req.params.id, name, description);
      const project = await Project.findByIdWithOwner(req.params.id);
      res.json({ message: 'Project updated successfully', project });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  async destroy(req, res) {
    try {
      const attachments = await Attachment.findByProject(req.params.id);
      attachments.forEach((a) => {
        fs.unlink(path.join(uploadsDir, a.filename), () => {});
      });
      await Project.destroyById(req.params.id);
      res.json({ message: 'Project deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = projectsController;
