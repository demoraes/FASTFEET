import { Op } from 'sequelize';
import { startOfHour, parseISO, isBefore } from 'date-fns';
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

    const orders = await Order.findAll({
      limit: 5,
      offset: (page - 1) * 5,
      where: {
        deliveryman_id: id,
        end_date: {
          [Op.ne]: null, // valor diferente de null
        },
      },
    });

    return res.json(orders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { order, start_date } = req.query;

    /**
     * Verifica se a retirada está sendo entre as 08h e 18h
     */
    const initAttendance = '08';
    const finishAttendance = '18';

    const [, date] = start_date.replace('T', ':').split(':');

    if (date <= initAttendance || date > finishAttendance) {
      return res.status(400).json({ error: 'Schedule is not permited' });
    }

    /**
     * Verifica se o horário da retirada é anterior ao horário atual
     * caso seja, retorna error
     */
    const hourStart = startOfHour(parseISO(start_date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const orderDelivery = await Order.findOne({
      where: { id: order, deliveryman_id: id },
    });

    const updateOrderDelivery = await orderDelivery.update({ start_date });

    return res.json(updateOrderDelivery);
  }

  async update(req, res) {
    const { id } = req.params;
    const { signature_id } = req.query;

    const endDelivered = await Order.findByPk(id);

    if (endDelivered.start_date === null) {
      return res.status(400).json({ error: 'Delivery not initiated' });
    }

    endDelivered.end_date = new Date();
    endDelivered.signature_id = signature_id;

    await endDelivered.save();

    return res.json(endDelivered);
  }
}

export default new DeliverymanController();
