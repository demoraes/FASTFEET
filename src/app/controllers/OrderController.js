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
    console.log(req.body);
    const order = await Order.create(req.body);

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
