import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const { deliveryman_query } = req.query;

    if (!deliveryman_query) {
      const deliverymans = await Deliveryman.findAll();

      return res.json(deliverymans);
    }
    const deliverymans = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: deliveryman_query,
        },
      },
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { name } = req.body;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (name !== deliveryman.name) {
      const deliveryManExists = await Deliveryman.findOne({ where: { name } });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'Delivery already exists' });
      }
    }

    const deliverymanUpdate = await deliveryman.update(req.body);

    return res.json(deliverymanUpdate);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Deliveryman.destroy({
      where: {
        id,
      },
    });

    return res.json();
  }
}

export default new DeliverymanController();
