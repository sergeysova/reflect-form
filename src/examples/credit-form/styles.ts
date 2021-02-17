import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 960px;
  margin: 0 auto;
`;

export const Content = styled.div`
  width: 80%;
  padding: 10%;
`;

export const Row = styled.div`
  display: flex;
  margin: 10px 0;

  & > div {
    flex: 1;
  }
`;
