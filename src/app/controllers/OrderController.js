// import * as Yup from 'yup';
import Order from '../models/Order';

class OrderController {
  async index(req, res) {
    const deliverymans = await Order.findAll();

    return res.json(deliverymans);
  }

  async store(req, res) {
    // const schema = Yup.object().shape({
    //   product: Yup.string().required(),
    //   start_date: Yup.string().required(),
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    const { signature_id, recipient_id, deliveryman_id } = req.query;
    const { product, start_date } = req.body;
    const order = await Order.create({
      product,
      start_date,
      signature_id,
      recipient_id,
      deliveryman_id,
    });

    const init = '08';
    const finish = '18';

    const [, date] = start_date.replace('T', ':').split(':');

    if (date <= init || date > finish) {
      return res.status(400).json({ error: 'Schedule is not permited' });
    }

    return res.json(order);
  }

  async update(req, res) {
    const { name } = req.body;

    const deliveryman = await Order.findByPk(req.params.id);

    if (name !== deliveryman.name) {
      const deliveryManExists = await Order.findOne({ where: { name } });

      if (deliveryManExists) {
        return res.status(400).json({ error: 'Delivery already exists' });
      }
    }

    const deliverymanUpdate = await deliveryman.update(req.body);

    return res.json(deliverymanUpdate);
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
