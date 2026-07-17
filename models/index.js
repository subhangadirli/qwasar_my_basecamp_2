const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Attachment = require('./Attachment');
const Thread = require('./Thread');
const Message = require('./Message');

// Associations (aliases match the `include` calls used inside the models).
Project.belongsTo(User, { as: 'owner', foreignKey: 'owner_id', onDelete: 'CASCADE' });
User.hasMany(Project, { foreignKey: 'owner_id', onDelete: 'CASCADE' });

ProjectMember.belongsTo(User, { as: 'user', foreignKey: 'user_id', onDelete: 'CASCADE' });
ProjectMember.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Project.hasMany(ProjectMember, { foreignKey: 'project_id', onDelete: 'CASCADE' });

Attachment.belongsTo(User, { as: 'uploader', foreignKey: 'uploader_id', onDelete: 'CASCADE' });
Attachment.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Project.hasMany(Attachment, { foreignKey: 'project_id', onDelete: 'CASCADE' });

Thread.belongsTo(User, { as: 'author', foreignKey: 'author_id', onDelete: 'CASCADE' });
Thread.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Project.hasMany(Thread, { foreignKey: 'project_id', onDelete: 'CASCADE' });

Message.belongsTo(User, { as: 'author', foreignKey: 'author_id', onDelete: 'CASCADE' });
Message.belongsTo(Thread, { foreignKey: 'thread_id', onDelete: 'CASCADE' });
Thread.hasMany(Message, { foreignKey: 'thread_id', onDelete: 'CASCADE' });

async function init() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Database synced');
}

module.exports = {
  sequelize,
  init,
  User,
  Project,
  ProjectMember,
  Attachment,
  Thread,
  Message
};
