import styled from 'styled-components';

export const Container = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #dddddd;
  opacity: 1;
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 64px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      width: 15%;
      height: 15%;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }

    a {
      font-weight: normal;
      color: #444444;
      font-size: 12px;
      padding-right: 15px;
      transition: 0.2s;
    }

    a:hover {
      color: #7159c1;
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;

  div {
    text-align: right;
    margin-right: 10px;

    a {
      display: block;
      font-weight: bold;
      color: #666666;
    }

    button {
      color: #de3b3b;
      border: none;
      background: none;
    }
  }
`;
