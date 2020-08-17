import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class Delivery {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { name, email, recipient, date } = data;

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
  }
}

export default new Delivery();
