const User = require('../models/User');

const isSelf = (req, res, next) => {
  if (req.session.userId === parseInt(req.params.id)) {
    return next();
  }
  res.status(403).json({ error: 'You do not have permission for this action' });
};

const isSelfOrAdmin = (req, res, next) => {
  if (req.session.userId === parseInt(req.params.id) || req.session.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'You do not have permission for this action' });
};

const isProjectOwner = (req, res, next) => {
  const Project = require('../models/Project');
  Project.findById(req.params.id, (err, project) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner_id !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    req.project = project;
    next();
  });
};

const isProjectAdmin = (req, res, next) => {
  const Project = require('../models/Project');
  Project.findById(req.params.id, (err, project) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner_id !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    req.project = project;
    next();
  });
};

const isProjectMember = (req, res, next) => {
  const Project = require('../models/Project');
  const ProjectMember = require('../models/ProjectMember');
  Project.findById(req.params.id, (err, project) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.owner_id === req.session.userId || req.session.isAdmin) {
      req.project = project;
      return next();
    }

    ProjectMember.findRole(project.id, req.session.userId, (err, row) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!row) {
        return res.status(403).json({ error: 'You do not have permission for this action' });
      }
      req.project = project;
      next();
    });
  });
};

module.exports = { isSelf, isSelfOrAdmin, isProjectOwner, isProjectAdmin, isProjectMember };