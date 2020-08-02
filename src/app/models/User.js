import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    /**
     * gerando hash da senha digitada pelo usuário
     * vale para o cadastro de usuário novo ou para edição de algum existente
     */
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /**
   * Fazendo relacionamento entre users e files, atraves do campo avatar_id
   */

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }

  /**
   * compara a senha que o usuário esta digitando com a senha que esta gravada no banco
   */
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
