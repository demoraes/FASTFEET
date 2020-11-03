/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

import {
  MdMoreHoriz,
  MdVisibility,
  MdCreate,
  MdDeleteForever,
} from 'react-icons/md';

import api from '../../../../services/api';

import TableAction from '../../../../components/Table/TableAction';
import { Container } from './styles';

function Action({ page, handleDetail, id, order }) {
  const [visible, setVisible] = useState(false);

  async function handleDelete() {
    try {
      await api.delete(`/order/${id}`);

      toast.success(`Item #${id} deletado com sucesso`);

      setTimeout(function () {
        document.location.reload(true);
      }, 3000);
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar excluir o item');
    }
  }

  function confirmDelete() {
    confirmAlert({
      title: 'Alerta',
      message: `Tem certeza que deseja deletar a encomenda ${id}?`,
      closeOnEscape: false,
      closeOnClickOutside: false,
      buttons: [
        {
          label: 'Sim',
          onClick: () => handleDelete(),
        },
        {
          label: 'Não',
        },
      ],
    });
  }

  function handleVisible() {
    setVisible(!visible);
  }

  return (
    <Container>
      <button onClick={handleVisible} type="button">
        <MdMoreHoriz size={30} color="#c6c6c6" />
      </button>

      <TableAction visible={visible}>
        <div>
          <button type="button" onClick={() => handleDetail(order)}>
            <MdVisibility size={30} color="#8E5BE8" />
            Visualizar
          </button>
        </div>
        <div>
          <Link to={page}>
            <MdCreate size={30} color="#4D85EE" />
            Editar
          </Link>
        </div>
        <div>
          <button type="button" onClick={confirmDelete}>
            <MdDeleteForever size={30} color="#DE3B3B" />
            Excluir
          </button>
        </div>
      </TableAction>
    </Container>
  );
}

export default Action;
