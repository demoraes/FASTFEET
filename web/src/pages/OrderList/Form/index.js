import React from 'react';

import { FormContainer } from '../../../components/Form';
import { HeaderForm } from '../../../components/ActionHeader';

import { SelectContainer } from './styles';

function OrderForm({ match }) {
  const { id } = match.params;

  return (
    <FormContainer>
      <HeaderForm id={id} prevPage="/orders" title="encomendas" />

      <SelectContainer>
        <h1>dwd</h1>
      </SelectContainer>
    </FormContainer>
  );
}

export default OrderForm;
