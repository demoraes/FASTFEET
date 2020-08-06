import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Order from '../models/Order';
import Notification from '../schemas/Notification';
import Recipients from '../models/Recipients';

class OrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const ordes = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(ordes);
  }

  async store(req, res) {
    /**
     * Validações de campos obrigatórios
     */
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { signature_id, recipient_id, deliveryman_id } = req.query;
    const { product, start_date } = req.body;

    /**
     * Verifica se a encomenda está sendo cadastrada entre as 08h e 18h
     */
    const initAttendance = '08';
    const finishAttendance = '18';

    const [, date] = start_date.replace('T', ':').split(':');

    if (date <= initAttendance || date > finishAttendance) {
      return res.status(400).json({ error: 'Schedule is not permited' });
    }

    /**
     * Verifica se o horário da requisição é anterior ao horário atual
     * caso seja, retorna error
     */
    const hourStart = startOfHour(parseISO(start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Criação da encomenda
     */
    const order = await Order.create({
      product,
      start_date,
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
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    /**
     * Notificação ao entregador
     */
    await Notification.create({
      content: `Nova encomenda para ${recipient.name} para o ${formattedDate}`,
      deliveryman: deliveryman_id,
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

    await Order.destroy({
      where: {
        id,
      },
    });

    return res.json();
  }
}

export default new OrderController();
