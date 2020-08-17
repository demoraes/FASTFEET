import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipients from '../models/Recipients';
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
    const { delivery_id } = req.headers;
    const { id } = req.params;

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

    const deliveryProblem = await DeliveryProblem.findByPk(id);

    const updateDeliveryProblem = await deliveryProblem.update(req.body);

    return res.json(updateDeliveryProblem);
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

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    order.canceled_at = new Date();

    await order.save();

    /**
     * Busca pelo administrador no banco
     */
    const user = await User.findOne({
      where: { name: 'admin' },
    });

    const date = new Date();

    /**
     * Envia email para o administrador, informando que a encomenda foi cancelada
     */
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
      context: {
        user: user.name,
        deliveryman: order.deliveryman.name,
        recipient: order.recipient.name,
        date: format(date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(order);
  }
}

export default new DeliveryProblemController();
