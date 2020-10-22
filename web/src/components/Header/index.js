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
          <img src={logo} alt="FastFeet" />
          <Link to="/orders">ENCOMENDAS</Link>
          <Link to="/deliveryman">ENTREGADORES</Link>
          <Link to="/recipients">DESTINATÁRIOS</Link>
          <Link to="/problems">PROBLEMAS</Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <Link to="/profile">Admin FastFeet</Link>
              <button type="button">sair do sistema</button>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
