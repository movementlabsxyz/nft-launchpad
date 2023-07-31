import { Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize) => sequelize.define('collection', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  creator_email: {
    type: DataTypes.STRING
  },
  creator_name: {
    type: DataTypes.STRING
  },
  creator_image: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  desc: {
    type: DataTypes.STRING
  },
  total_supply: {
    type: DataTypes.INTEGER
  },
  mint_price: {
    type: DataTypes.STRING
  },
  images_uri: {
    type: DataTypes.STRING
  },
  jsons_uri: {
    type: DataTypes.STRING
  },
  logo_uri: {
    type: DataTypes.STRING
  },
  tx_hash: {
    type: DataTypes.STRING
  }
}, {})