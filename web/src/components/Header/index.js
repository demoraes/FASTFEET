import React from 'react';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png';

// import Notifications from '../Notifications/index';

import { Container, Content, Profile } from './styles';

export default function Header() {
  // const profile = useSelector((state) => state.user.profile);

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GoBarber" />
          <Link to="/dashboard">ENCOMENDAS</Link>
          <Link to="/dashboard">ENTREGADORES</Link>
          <Link to="/dashboard">DESTINATÁRIOS</Link>
          <Link to="/dashboard">PROBLEMAS</Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong>Admin FastFeet</strong>
              <button type="button">sair do sistema</button>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
