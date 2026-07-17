const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');

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

const isProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findByIdWithOwner(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner_id !== req.session.userId && !req.session.isAdmin) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin-level access is currently equivalent to project ownership.
const isProjectAdmin = isProjectOwner;

const isProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findByIdWithOwner(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.owner_id === req.session.userId || req.session.isAdmin) {
      req.project = project;
      return next();
    }

    const role = await ProjectMember.findRole(project.id, req.session.userId);
    if (!role) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { isSelf, isSelfOrAdmin, isProjectOwner, isProjectAdmin, isProjectMember };
