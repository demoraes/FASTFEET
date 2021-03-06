import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

import { toast } from 'react-toastify';
import { TableContainer, TableLoading } from '../../../components/Table';
import { HeaderList } from '../../../components/ActionHeader';
import Action from './Action';
import Details from './Details';
import Pagination from '../../../components/Pagination';

import api from '../../../services/api';

import { Status } from './styles';

function OrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
      try {
        setLoading(true);

        const response = await api.get('order', {
          params: {
            page: currentPage,
            query_product: search,
          },
        });

        const data = response.data.orders.map((order) => {
          return {
            ...order,
            formattedStatus: getFormattedStatus(order),
            street_number: `${order.recipient.street}, ${order.recipient.number}`,
            city_state: `${order.recipient.city} - ${order.recipient.state}`,
            start_date_formatted: order.start_date
              ? format(parseISO(order.start_date), 'dd/MM/yyyy')
              : null,
            end_date_formatted: order.end_date
              ? format(parseISO(order.end_date), 'dd/MM/yyyy')
              : null,
          };
        });

        if (!response.data) {
          toast.warn('Nenhuma encomenda cadastrada');
        }

        console.tron.log(response.data.total);
        setLoading(false);
        setPages(response.data.pages);
        setTotalOrders(response.data.total);
        setOrders(data);
      } catch (error) {
        toast.error('Não foi possível carregar as informações das encomendas');
      }
    }

    loadOrders();
  }, [currentPage, search]);

  function handlePage(page) {
    if (page === 0) {
      setCurrentPage(1);
    } else if (page > pages) {
      setCurrentPage(pages);
    } else {
      setCurrentPage(page);
    }
  }

  function handleVisible() {
    setVisible(!visible);
  }

  function handleDetail(order) {
    setOrderDetail(order);
    handleVisible();
  }

  return (
    <>
      <HeaderList
        lowercaseTitle="encomendas"
        page="order/new"
        visible
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <TableLoading />
      ) : (
        <>
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
              {orders.map(({ deliveryman, recipient, ...order }) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{recipient.name}</td>
                  <td>
                    <div>
                      <img
                        src={
                          deliveryman.avatar.url ||
                          'https://avatars2.githubusercontent.com/u/20407168?s=460&u=818190c63bbd10d67f40e6c2ece393d8cda17e03&v=4'
                        }
                        alt="Avatar"
                      />
                      {deliveryman.name}
                    </div>
                  </td>
                  <td>{recipient.city}</td>
                  <td>{recipient.state}</td>
                  <td>
                    <Status status={order.formattedStatus}>
                      <span>{order.formattedStatus.text}</span>
                    </Status>
                  </td>
                  <Action
                    page={`/order/edit/${order.id}`}
                    handleDetail={() => handleDetail(order)}
                    id={order.id}
                    order={orderDetail}
                  />
                </tr>
              ))}
            </tbody>
          </TableContainer>

          <Details
            visible={visible}
            order={orderDetail}
            handleVisible={handleVisible}
          />

          <Pagination
            currentPage={currentPage}
            pages={pages}
            totalDocs={totalOrders}
            handlePage={handlePage}
          />
        </>
      )}
    </>
  );
}

export default OrderList;
