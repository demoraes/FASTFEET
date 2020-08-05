import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipients from '../app/models/Recipients';
import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';
import Order from '../app/models/Order';

import databaseConfig from '../config/database';

const models = [User, Recipients, Deliveryman, Order, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    /**
     * Conecta com o banco
     */
    this.connection = new Sequelize(databaseConfig);
    /**
     * Carrega os models e relacionamentos
     */
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
