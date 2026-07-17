const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Message extends Model {
  static async createMessage(thread_id, author_id, body) {
    const message = await Message.create({ thread_id, author_id, body });
    return { id: message.id, thread_id, author_id, body };
  }

  static async findByThread(thread_id) {
    const messages = await Message.findAll({
      where: { thread_id },
      include: [{ model: User, as: 'author', attributes: ['username'] }],
      order: [['created_at', 'ASC']]
    });
    return messages.map((m) => {
      const json = m.toJSON();
      json.author_name = json.author ? json.author.username : null;
      delete json.author;
      return json;
    });
  }

  static findById(id) {
    return Message.findByPk(id);
  }

  static updateMessage(id, body) {
    return Message.update({ body }, { where: { id } });
  }

  static destroyById(id) {
    return Message.destroy({ where: { id } });
  }
}

Message.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thread_id: { type: DataTypes.INTEGER, allowNull: false },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = Message;
