import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipients from '../models/Recipients';

class RecipientController {
  async index(req, res) {
    const { page = 1, name_query } = req.query;

    if (!name_query) {
      const recipients = await Recipients.findAll({
        limit: 5,
        offset: (page - 1) * 5,
      });

      return res.json(recipients);
    }
    const recipients = await Recipients.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      where: {
        name: {
          [Op.iLike]: name_query,
        },
      },
    });

    return res.json(recipients);
  }

  async store(req, res) {
    /**
     * Validação dos campos, sendo obrigatório o preenchimento
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    /**
     * Criando recipient no banco
     */
    const recipient = await Recipients.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    /**
     * Pega o id do recipient e depois atualiza
     */

    const { id } = req.params;
    const { name } = req.body;

    const recipient = await Recipients.findByPk(id);

    const {
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
