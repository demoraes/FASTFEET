/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdMoreHoriz,
  MdVisibility,
  MdCreate,
  MdDeleteForever,
} from 'react-icons/md';

import TableAction from '../../../../components/Table/TableAction';
import { Container } from './styles';

function Action({ page }) {
  const [visible, setVisible] = useState(false);

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
          <button type="button">
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
          <button type="button">
            <MdDeleteForever size={30} color="#DE3B3B" />
            Excluir
          </button>
        </div>
      </TableAction>
    </Container>
  );
}

export default Action;
