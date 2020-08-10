import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Notification from '../schemas/Notification';
import Recipients from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const ordes = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      attributes: ['id', 'product'],
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
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Nova encomenda',
      template: 'delivery',
      context: {
        deliveryman: name,
        recipient: recipient.name,
        date: format(parseISO(date), "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(order);
  }

  async update(req, res) {
    const { id } = req.params;
    const { end_date, canceled_at } = req.body;

    const order = await Order.findByPk(id);

    if (canceled_at) {
      const orderUpdate = await order.update({ canceled_at });

      return res.json(orderUpdate);
    }
    const orderUpdate = await order.update({ end_date });
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
