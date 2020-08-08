import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliverymanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { id } = req.params;

    const recipients = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      where: { deliveryman_id: id, canceled_at: null, end_date: null },
    });

    return res.json(recipients);
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    const { id } = req.params;

    const recipients = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      where: { deliveryman_id: id, end_date: true },
    });

    return res.json(recipients);
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
