import * as Yup from 'yup';
import Order from '../models/Order';

class OrderController {
  async index(req, res) {
    const deliverymans = await Order.findAll();

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { signature_id, recipient_id, deliveryman_id } = req.query;
    const { product, start_date } = req.body;

    const initAttendance = '08';
    const finishAttendance = '18';

    const [, date] = start_date.replace('T', ':').split(':');

    if (date <= initAttendance || date > finishAttendance) {
      return res.status(400).json({ error: 'Schedule is not permited' });
    }

    const order = await Order.create({
      product,
      start_date,
      signature_id,
      recipient_id,
      deliveryman_id,
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
