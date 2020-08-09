import * as Yup from 'yup';
import DeliveryProblem from '../schemas/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
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

    await Deliveryman.destroy({
      where: {
        id,
      },
    });

    return res.json();
  }
}

export default new DeliveryProblemController();
