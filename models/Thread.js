const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

function flattenAuthor(thread) {
  if (!thread) return thread;
  const json = thread.toJSON();
  json.author_name = json.author ? json.author.username : null;
  delete json.author;
  return json;
}

const withAuthor = {
  include: [{ model: User, as: 'author', attributes: ['username'] }]
};

class Thread extends Model {
  static async createThread(project_id, author_id, title, body) {
    const thread = await Thread.create({ project_id, author_id, title, body });
    return { id: thread.id, project_id, author_id, title, body };
  }

  static async findByProject(project_id) {
    const threads = await Thread.findAll({
      where: { project_id },
      ...withAuthor,
      order: [['created_at', 'DESC']]
    });
    return threads.map(flattenAuthor);
  }

  static async findByIdWithAuthor(id) {
    const thread = await Thread.findByPk(id, withAuthor);
    return flattenAuthor(thread);
  }

  static updateThread(id, title, body) {
    return Thread.update({ title, body }, { where: { id } });
  }

  static destroyById(id) {
    return Thread.destroy({ where: { id } });
  }
}

Thread.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    body: { type: DataTypes.TEXT }
  },
  {
    sequelize,
    modelName: 'Thread',
    tableName: 'threads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Thread;
