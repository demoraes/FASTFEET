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

  const deliverymanOptions = deliveryman.map((recipient) => {
    const data = {
      value: recipient,
      label: recipient.name,
    };

    return data;
  });

  return (
    <>
      {loading ? (
        <FormLoading />
      ) : (
        <FormContainer initialData={orders}>
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
              />

              <Select
                name="order.deliveryman.name"
                label="Entregador"
                placeholder="Selecione um entregador"
                options={deliverymanOptions}
                defaultValue={{
                  label: selectedDeliveryman.name,
                  value: selectedDeliveryman.id,
                }}
              />

              <Input
                name="product"
                label="Nome do produto"
                placeholder="Ex: Notebook"
              />
            </SelectContainer>
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
