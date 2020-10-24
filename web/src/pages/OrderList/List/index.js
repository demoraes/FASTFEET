import React, { useState, useEffect } from 'react';

import { TableContainer } from '../../../components/Table';
import Action from './Action';

import api from '../../../services/api';

import { Status } from './styles';

function OrderList() {
  const [orders, setOrders] = useState([]);

  const getFormattedStatus = (order) => {
    let status = {};

    if (order.canceled_at) {
      status = { text: 'CANCELADA', background: '#FAB0B0', color: '#DE3B3B' };
      return status;
    }

    if (order.end_date) {
      status = { text: 'ENTREGUE', background: '#DFF0DF', color: '#2CA42B' };
      return status;
    }

    if (order.start_date) {
      status = { text: 'RETIRADA', background: '#BAD2FF', color: '#4D85EE' };
      return status;
    }

    status = { text: 'PENDENTE', background: '#F0F0DF', color: '#C1BC35' };

    return status;
  };

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get('order');

      const data = response.data.map((order) => {
        return {
          ...order,
          formattedStatus: getFormattedStatus(order),
        };
      });

      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <TableContainer>
      <thead>
        <tr>
          <th>ID</th>
          <th>Destinatário</th>
          <th>Entregador</th>
          <th>Cidade</th>
          <th>Estado</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr>
            <td>#{order.id}</td>
            <td>{order.recipient.name}</td>
            <td>
              <div>
                <img
                  src="https://avatars2.githubusercontent.com/u/20407168?s=460&u=818190c63bbd10d67f40e6c2ece393d8cda17e03&v=4"
                  alt="Gabriel Moraes"
                />
                {order.deliveryman.name}
              </div>
            </td>
            <td>{order.recipient.city}</td>
            <td>{order.recipient.state}</td>
            <td>
              <Status status={order.formattedStatus}>
                <span>{order.formattedStatus.text}</span>
              </Status>
            </td>
            <Action />
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
}

export default OrderList;
