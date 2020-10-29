import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Notification from '../schemas/Notification';
import Recipients from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import Delivery from '../jobs/Delivery';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page = 1, query_product } = req.query;

    if (!query_product) {
      const ordes = await Order.findAll({
        limit: 5,
        offset: (page - 1) * 5,
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
              },
            ],
          },
          {
            model: Recipients,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'city',
              'state',
              'street',
              'number',
              'zip_code',
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      return res.json(ordes);
    }

    const ordes = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'city',
            'state',
            'street',
            'number',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
      where: {
        product: {
          [Op.iLike]: `%${query_product}%`,
        },
      },
    });

    return res.json(ordes);
  }

  async store(req, res) {
    /**
     * Validações de campos obrigatórios
     */
    const schema = Yup.object().shape({
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { signature_id, recipient_id, deliveryman_id } = req.query;
    const { product, date } = req.body;

    /**
     * Criação da encomenda
     */
    const order = await Order.create({
      product,
      signature_id,
      recipient_id,
      deliveryman_id,
    });

    /**
     * Pegando ID do destinatário para mostrar o nome dele para o entregador
     */
    const recipient = await Recipients.findByPk(recipient_id);

    /**
     * Formatação do horário e dia
     */
    const formattedDate = format(
      parseISO(date),
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    /**
     * Notificação ao entregador
     */
    await Notification.create({
      content: `Entregar ${product} para ${recipient.name}, ${formattedDate}`,
      deliveryman: deliveryman_id,
    });

    /**
     * Pegando ID do entregador
     */
    const { name, email } = await Deliveryman.findByPk(deliveryman_id);

    /**
     * Enviando email para o entregador
     */
    await Queue.add(Delivery.key, {
      name,
      email,
      recipient,
      date,
    });

    return res.json(order);
  }

  async show(req, res) {
    const { id } = req.params;

    const verify = await Order.findOne({
      where: { id },
    });

    if (!verify) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const ordes = await Order.findOne({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: Recipients,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'city',
            'state',
            'street',
            'number',
            'zip_code',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
      where: {
        id,
      },
    });

    return res.json(ordes);
  }

  async update(req, res) {
    const { id } = req.params;

    const verify = await Order.findOne({
      where: { id },
    });

    if (!verify) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const order = await Order.findByPk(id);

    const orderUpdate = await order.update(req.body);

    return res.json(orderUpdate);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    order.canceled_at = new Date();

    await order.save();

    await Order.destroy({
      where: {
        id,
      },
    });

    return res.json(order);
  }
}

export default new OrderController();
