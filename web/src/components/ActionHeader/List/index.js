import React from 'react';
import PropTypes from 'prop-types';
import { MdSearch, MdAdd } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { Container, SearchBar } from './styles';

function HeaderList({ lowercaseTitle, page, visible, search, setSearch }) {
  return (
    <Container visible={visible}>
      <h1>Gerenciado {lowercaseTitle}</h1>

      <div>
        <SearchBar>
          <MdSearch size={22} color="#999" />
          <input
            type="text"
            placeholder={`Buscar por ${lowercaseTitle}`}
            value={search}
            onChange={(e) => [setSearch(e.target.value)]}
          />
        </SearchBar>
        <Link to={`/${page}`}>
          <MdAdd size={22} color="#000" />
          CADASTRAR
        </Link>
      </div>
    </Container>
  );
}

export default HeaderList;

HeaderList.defaultProps = {
  search: null,
  setSearch: null,
};

HeaderList.propTypes = {
  lowercaseTitle: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func,
};
