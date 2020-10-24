import styled from 'styled-components';

export const Status = styled.span`
  background-color: ${(props) => props.status.background} !important;
  color: ${(props) => props.status.color} !important;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  padding: 3px 7px 3px 25px;
  border-radius: 12px;

  &:before {
    content: '';
    position: absolute;
    height: 10px;
    width: 10px;
    left: 8px;
    top: 8px;
    background: ${(props) => props.status.color};
    border-radius: 50%;
  }
`;
