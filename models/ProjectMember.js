const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class ProjectMember extends Model {
  static async add(project_id, user_id, role) {
    const [member] = await ProjectMember.findOrCreate({
      where: { project_id, user_id },
      defaults: { role: role || 'member' }
    });
    return { id: member.id, project_id, user_id, role: member.role };
  }

  static async findByProject(project_id) {
    const members = await ProjectMember.findAll({
      where: { project_id },
      attributes: ['id', 'user_id', 'role', 'created_at'],
      include: [{ model: User, as: 'user', attributes: ['username', 'email'] }],
      order: [['created_at', 'ASC']]
    });
    return members.map((m) => {
      const json = m.toJSON();
      json.username = json.user ? json.user.username : null;
      json.email = json.user ? json.user.email : null;
      delete json.user;
      return json;
    });
  }

  static findRole(project_id, user_id) {
    return ProjectMember.findOne({
      where: { project_id, user_id },
      attributes: ['role']
    });
  }

  static remove(project_id, user_id) {
    return ProjectMember.destroy({ where: { project_id, user_id } });
  }
}

ProjectMember.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role: { type: DataTypes.TEXT, defaultValue: 'member' }
  },
  {
    sequelize,
    modelName: 'ProjectMember',
    tableName: 'project_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [{ unique: true, fields: ['project_id', 'user_id'] }]
  }
);

module.exports = ProjectMember;
