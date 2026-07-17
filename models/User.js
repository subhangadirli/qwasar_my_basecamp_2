const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const PUBLIC_ATTRS = ['id', 'username', 'email', 'is_admin', 'created_at'];

class User extends Model {
  static getAll() {
    return User.findAll({ attributes: PUBLIC_ATTRS });
  }

  static findPublicById(id) {
    return User.findByPk(id, { attributes: PUBLIC_ATTRS });
  }

  static findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  static async createUser(username, email, password) {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password_hash });
    return { id: user.id, username: user.username, email: user.email };
  }

  static destroyById(id) {
    return User.destroy({ where: { id } });
  }

  static setAdmin(id) {
    return User.update({ is_admin: 1 }, { where: { id } });
  }

  static removeAdmin(id) {
    return User.update({ is_admin: 0 }, { where: { id } });
  }

  static validatePassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.TEXT, allowNull: false, unique: true },
    email: { type: DataTypes.TEXT, allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    is_admin: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = User;
