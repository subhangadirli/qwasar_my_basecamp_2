const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Attachment extends Model {
  static async createAttachment({ project_id, uploader_id, filename, original_name, format, size }) {
    const attachment = await Attachment.create({
      project_id, uploader_id, filename, original_name, format, size
    });
    return {
      id: attachment.id,
      project_id, uploader_id, filename, original_name, format, size
    };
  }

  static async findByProject(project_id) {
    const attachments = await Attachment.findAll({
      where: { project_id },
      include: [{ model: User, as: 'uploader', attributes: ['username'] }],
      order: [['created_at', 'DESC']]
    });
    return attachments.map((a) => {
      const json = a.toJSON();
      json.uploader_name = json.uploader ? json.uploader.username : null;
      delete json.uploader;
      return json;
    });
  }

  static findById(id) {
    return Attachment.findByPk(id);
  }

  static destroyById(id) {
    return Attachment.destroy({ where: { id } });
  }
}

Attachment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    uploader_id: { type: DataTypes.INTEGER, allowNull: false },
    filename: { type: DataTypes.TEXT, allowNull: false },
    original_name: { type: DataTypes.TEXT, allowNull: false },
    format: { type: DataTypes.TEXT, allowNull: false },
    size: { type: DataTypes.INTEGER }
  },
  {
    sequelize,
    modelName: 'Attachment',
    tableName: 'attachments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = Attachment;
