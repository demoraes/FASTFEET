/* eslint-disable no-inner-declarations */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { FormContainer, Select, Input } from '../../../components/Form';
import { HeaderForm } from '../../../components/ActionHeader';

import { SelectContainer } from './styles';

import api from '../../../services/api';

function OrderForm({ match }) {
  const { id } = match.params;

  const [recipients, setRecipients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryman, setDeliveryman] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState([]);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState([]);

  useEffect(() => {
    if (id) {
      async function loadDeliveryDetails() {
        try {
          const response = await api.get(`/order/${id}`);

          console.tron.log(response);

          setOrders(response.data);
          setSelectedDeliveryman(response.data.recipient);
          setSelectedRecipient(response.data.deliveryman);
        } catch (info) {
          toast.info(
            'Escolha os dados que deseja atualizar da encomenda escolhida'
          );
        }
      }

      loadDeliveryDetails();
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

  const deliveryOptions = deliveryman.map((recipient) => {
    const data = {
      value: recipient,
      label: recipient.name,
    };

    return data;
  });

  return (
    <FormContainer>
      <HeaderForm id={id} prevPage="/orders" title="encomendas" />

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
          />

          <Select
            name="order.name"
            label="Entregador"
            placeholder="Selecione um entregador"
            options={deliveryOptions}
          />

          <Input
            name="product"
            label="Nome do produto"
            placeholder="Ex: Notebook"
          />
        </SelectContainer>
      </section>
    </FormContainer>
  );
}

export default OrderForm;
