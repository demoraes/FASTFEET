import Recipients from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipients.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    const recipient = await Recipients.findByPk(id);

    const {
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
