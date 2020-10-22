import React from 'react';

import { TableContainer } from '../../components/Table';

// import { Container } from './styles';

export default function Orders() {
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
        <tr>
          <td>#01</td>
          <td>Ludwig van Bethoven</td>
          <td>
            <div>
              <img
                src="https://avatars2.githubusercontent.com/u/20407168?s=460&u=818190c63bbd10d67f40e6c2ece393d8cda17e03&v=4"
                alt="Gabriel Moraes"
              />
              John Doe
            </div>
          </td>
          <td>Rio do sul</td>
          <td>Santa catarina</td>
          <td>dwd</td>
          <td>dwd</td>
        </tr>
      </tbody>
    </TableContainer>
  );
}
