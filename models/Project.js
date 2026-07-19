const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

function flattenOwner(project) {
  if (!project) return project;
  const json = project.toJSON();
  json.owner_name = json.owner ? json.owner.username : null;
  delete json.owner;
  return json;
}

const withOwner = {
  include: [{ model: User, as: 'owner', attributes: ['username'] }]
};

class Project extends Model {
  static async getAll() {
    const projects = await Project.findAll(withOwner);
    return projects.map(flattenOwner);
  }

  static async findByIdWithOwner(id) {
    const project = await Project.findByPk(id, withOwner);
    return flattenOwner(project);
  }

  static findByOwner(owner_id) {
    return Project.findAll({ where: { owner_id } });
  }

  static async createProject(name, description, owner_id) {
    const project = await Project.create({ name, description, owner_id });
    return { id: project.id, name: project.name, description: project.description, owner_id };
  }

  static updateProject(id, name, description) {
    return Project.update({ name, description }, { where: { id } });
  }

  static destroyById(id, options = {}) {
    return Project.destroy({ where: { id }, ...options });
  }
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    owner_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Project;
