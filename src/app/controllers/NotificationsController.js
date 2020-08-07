import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const { deliveryman_id } = req.query;

    const notifications = await Notification.find({
      deliveryman: deliveryman_id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
