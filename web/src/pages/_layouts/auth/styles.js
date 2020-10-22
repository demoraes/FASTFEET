import styled from 'styled-components';
import { darken } from 'polished';

export const Wrapper = styled.div`
  height: 100%;
  background: #7d40e7;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 50%;
  max-width: 400px;
  text-align: center;

  form {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 0px 10px #00000033;
    border-radius: 4px;
    padding: 50px;

    img {
      align-self: center;
      width: 80%;
      height: 100%;
      padding-bottom: 25px;
    }

    label {
      text-align: left;
      letter-spacing: 0px;
      color: #444444;
      margin-bottom: 5px;
      opacity: 1;
    }

    input {
      background: #ffffff 0% 0% no-repeat padding-box;
      border: 1px solid #dddddd;
      border-radius: 4px;
      opacity: 1;
      height: 44px;
      padding: 0 15px;
      margin: 0 0 10px;
    }

    span {
      color: #f66f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #7d40e7 0% 0% no-repeat padding-box;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      opacity: 1;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, '#7d40e7')};
      }
    }
  }
`;
