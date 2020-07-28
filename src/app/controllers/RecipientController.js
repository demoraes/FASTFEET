import Recipients from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const recipient = await Recipients.create(req.body);

    console.log(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
