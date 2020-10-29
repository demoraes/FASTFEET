import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { Container, HeaderAction } from './styles';

function TableLoading() {
  return (
    <Container>
      <div>
        <HeaderAction>
          <Skeleton height={350} />
        </HeaderAction>
      </div>
    </Container>
  );
}

export default TableLoading;
