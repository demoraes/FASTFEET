/* eslint-disable no-inner-declarations */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import {
  FormContainer,
  Select,
  Input,
  FormLoading,
} from '../../../components/Form';
import { HeaderForm } from '../../../components/ActionHeader';

import { SelectContainer } from './styles';

import api from '../../../services/api';

export default function OrderForm({ match }) {
  const { id } = match.params;

  const [orders, setOrders] = useState({});
  const [recipients, setRecipients] = useState([]);
  const [deliveryman, setDeliveryman] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState([]);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (id) {
      async function loadOrdersDetails() {
        try {
          setLoading(true);
          const response = await api.get(`/order/${id}`);

          setOrders(response.data);
          setSelectedDeliveryman(response.data.deliveryman);
          setSelectedRecipient(response.data.recipient);

          setLoading(false);
        } catch (info) {
          toast.info(
            'Escolha os dados que deseja atualizar da encomenda escolhida'
          );
        }
      }

      loadOrdersDetails();
      // console.tron.log(selectedRecipient);
    }
  }, [id]);

  useEffect(() => {
    async function loadSelectOptions() {
      const [recipientResponse, orderResponse] = await Promise.all([
        api.get('recipients'),
        api.get('deliveryman'),
      ]);

      setRecipients(recipientResponse.data);
      setDeliveryman(orderResponse.data);
    }

    loadSelectOptions();
  }, []);

  const recipientsOptions = recipients.map((recipient) => {
    const data = {
      value: recipient,
      label: recipient.name,
    };

    return data;
  });

  const handleChangeRecipient = (selectedOption) => {
    const { value } = selectedOption;

    console.tron.log(value);

    setSelectedRecipient(value);
  };

  const deliverymanOptions = deliveryman.map((recipient) => {
    const data = {
      value: recipient,
      label: recipient.name,
    };

    return data;
  });

  const handleChangeDeliveryman = (selectedOption) => {
    const { value } = selectedOption;
    console.tron.log(value);

    setSelectedDeliveryman(value);
  };

  async function handleSubmit({ product, recipient_id, deliveryman_id }) {
    try {
      setButtonLoading(true);

      if (id) {
        // deliverymans_id = selectedDeliveryman.id;
        // recipients_id = selectedRecipient.id;
        // const data = { product, deliverymans_id, recipients_id };
        // api.put(`/order/${id}`, data);
      }

      if (!id) {
        console.tron.log(deliveryman_id);
        deliveryman_id = selectedDeliveryman.id;
        recipient_id = selectedRecipient.id;
        const data = { product, recipient_id, deliveryman_id };
        await api.post('/order', data);
      }

      setButtonLoading(false);
    } catch (error) {
      toast.error('Algo deu errado ao salvar a encomenda');
    }
  }

  return (
    <>
      {loading ? (
        <FormLoading />
      ) : (
        <FormContainer
          onSubmit={handleSubmit}
          initialData={orders}
          loading={buttonLoading}
        >
          <HeaderForm
            id={id}
            prevPage="/orders"
            title="encomendas"
            loading={loading}
          />

          <section>
            <SelectContainer>
              <Select
                name="recipient.name"
                label="Distinatário"
                placeholder="Selecione um destinatário"
                options={recipientsOptions}
                defaultValue={{
                  value: selectedRecipient.id,
                  label: selectedRecipient.name,
                }}
                onChange={handleChangeRecipient}
              />

              <Select
                name="deliveryman.name"
                label="Entregador"
                placeholder="Selecione um entregador"
                options={deliverymanOptions}
                defaultValue={{
                  label: selectedDeliveryman.name,
                  value: selectedDeliveryman.id,
                }}
                onChange={handleChangeDeliveryman}
              />
            </SelectContainer>

            <Input
              name="product"
              label="Nome do produto"
              placeholder="Ex: Notebook"
            />
          </section>
        </FormContainer>
      )}
    </>
  );
}

OrderForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
};
