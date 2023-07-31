import { Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize) => sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  wallet: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.INTEGER
  },
  nonce: {
    type: DataTypes.STRING
  },
}, {})