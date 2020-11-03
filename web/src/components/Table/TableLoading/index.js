import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Container, TableContainer, Pagination } from './styles';

function TableLoading() {
  return (
    <Container>
      <div>
        <TableContainer>
          <Skeleton height={44} />
          <Skeleton height={57} count={10} />
        </TableContainer>

        <Pagination>
          <Skeleton widthw={60} height={30} />
          <Skeleton width={140} height={30} />
        </Pagination>
      </div>
    </Container>
  );
}

export default TableLoading;
