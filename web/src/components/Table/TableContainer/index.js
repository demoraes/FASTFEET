import styled from 'styled-components';

const TableContainer = styled.table`
  margin: 0 auto;
  width: 90%;
  border-collapse: separate;
  border-spacing: 0 20px;

  thead th {
    text-align: left;
    color: #444;
    font-size: 16px;
    padding: 6px 15px 0;

    &:last-child {
      text-align: right;
    }
  }

  tbody td {
    height: 57px;
    padding: 6px 15px;
    color: #555;
    font-size: 16px;

    border-top: 1px solid #555;
    border-bottom: 1px solid #555;

    &:last-child {
      text-align: right;
      border-right: 1px solid #555;
    }

    &:first-child {
      border-left: 1px solid #555;
    }

    div {
      display: flex;
      align-items: center;

      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
  }
`;

export default TableContainer;
