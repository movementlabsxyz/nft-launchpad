import dbConfig from '../db.config.json';
import { Sequelize, Dialect } from 'sequelize';
import CollectionModel from './collection';
import UsersModel from './users';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  username: dbConfig.USER,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect as Dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const Collection = CollectionModel(sequelize);
const User = UsersModel(sequelize);

export default {
  Sequelize,
  sequelize,
  Collection,
  User
}