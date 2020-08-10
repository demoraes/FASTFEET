import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import User from '../models/User';

import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const delivery = await DeliveryProblem.findAll({
      limit: 10,
      offset: (page - 1) * 6,
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'product'],
        },
      ],
    });

    return res.json(delivery);
  }

  async show(req, res) {
    const { page = 1 } = req.query;
    const { id } = req.params;

    const delivery = await DeliveryProblem.findAll({
      where: { delivery_id: id },
      limit: 10,
      offset: (page - 1) * 6,
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'product'],
        },
      ],
    });

    return res.json(delivery);
  }

  async store(req, res) {
    const { delivery_id } = req.headers;
    const { description } = req.body;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Order.findOne({ where: { id: delivery_id } });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(deliveryProblem);
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

    const delivery = await DeliveryProblem.findOne({
      where: { delivery_id: id },
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Smooth delivery, please advise the reason for cancellation',
      });
    }

    const order = await Order.findByPk(id);

    order.canceled_at = new Date();

    await order.save();

    /**
     * Busca pelo administrador no banco
     */
    const { name, email } = await User.findOne({
      where: { name: 'admin' },
    });

    /**
     * Envia email para o administrador, informando que a encomenda foi cancelada
     */
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Encomenda cancelada',
      template: 'delivery',
      context: {},
    });

    return res.json(order);
  }
}

export default new DeliveryProblemController();
